/* eslint-disable */
import Web3 from 'web3'
import store from '@/store'
import { getChainApi } from '@/utils/chainApi'
import {
  integerToDecimal,
  decimalToInteger,
  toStandardHex,
  integerToHex,
  reverseHex
} from '@/utils/convertors'
import {
  WalletName,
  ChainId,
  SingleTransactionStatus,
  NetworkChainIdMaps,
  EthNetworkChainIdMaps
} from '@/utils/enums'
import { WalletError } from '@/utils/errors'
import { TARGET_MAINNET } from '@/utils/env'
import { tryToConvertAddressToHex } from '.'

const META_MASK_CONNECTED_KEY = 'META_MASK_CONNECTED'
const NFT_FEE_TOKEN_HASH = '0x0000000000000000000000000000000000000000'
const PLT_NFT_FEE_TOKEN_HASH = '0x0000000000000000000000000000000000000103'

const NETWORK_CHAIN_ID_MAPS = NetworkChainIdMaps

const ETH_NETWORK_CHAIN_ID_MAPS = EthNetworkChainIdMaps

let web3

function confirmLater(promise) {
  return new Promise((resolve, reject) => {
    promise.on('transactionHash', resolve)
    promise.on('error', reject)

    function onConfirm(confNumber, receipt) {
      promise.off('confirmation', onConfirm)
    }
    promise.on('confirmation', onConfirm)
  })
}

function convertWalletError(error) {
  if (error instanceof WalletError) {
    return error
  }
  let code = WalletError.CODES.UNKNOWN_ERROR
  if (error.code === 4001) {
    code = WalletError.CODES.USER_REJECTED
  }
  if (error.toString().indexOf('32005') > -1) {
    return null
  }
  if (error.toString().indexOf('32000') > -1) {
    return null
  }
  return new WalletError(error.message, { code, cause: error })
}

async function queryState() {
  const accounts = await window.ethereum.request({ method: 'eth_accounts' })
  const address = accounts[0] || null
  const addressHex = await tryToConvertAddressToHex(
    WalletName.MetaMask,
    address
  )
  const checksumAddress = address && web3.utils.toChecksumAddress(address)
  const network = await window.ethereum.request({ method: 'eth_chainId' })
  console.log(Number(network))
  store.dispatch('updateWallet', {
    name: WalletName.MetaMask,
    address: checksumAddress,
    addressHex,
    connected: !!checksumAddress,
    chainId: NETWORK_CHAIN_ID_MAPS[Number(network)],
    walletChainId: 2
  })
  store.dispatch('setChainSelectedWallet', {
    chainId: NETWORK_CHAIN_ID_MAPS[Number(network)],
    walletName: WalletName.MetaMask
  })
}

async function init() {
  console.log('metamask init')
  try {
    if (!window.ethereum) {
      return
    }
    web3 = new Web3(window.ethereum)
    const network = await window.ethereum.request({ method: 'eth_chainId' })

    store.dispatch('updateWallet', {
      name: WalletName.MetaMask,
      installed: true,
      chainId: NETWORK_CHAIN_ID_MAPS[Number(network)]
    })

    if (sessionStorage.getItem(META_MASK_CONNECTED_KEY) === 'true') {
      await queryState()
    }

    window.ethereum.on('accountsChanged', async (accounts) => {
      const address = accounts[0] || null
      const addressHex = await tryToConvertAddressToHex(
        WalletName.MetaMask,
        address
      )
      const checksumAddress = address && web3.utils.toChecksumAddress(address)
      store.dispatch('updateWallet', {
        name: WalletName.MetaMask,
        address: checksumAddress,
        addressHex,
        connected: !!checksumAddress
      })
    })

    window.ethereum.on('chainChanged', (network) => {
      store.dispatch('updateWallet', {
        name: WalletName.MetaMask,
        chainId: NETWORK_CHAIN_ID_MAPS[Number(network)]
      })
    })
  } finally {
    store.getters.getWallet(WalletName.MetaMask).deferred.resolve()
  }
}

async function connect() {
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    await queryState()
    sessionStorage.setItem(META_MASK_CONNECTED_KEY, 'true')
  } catch (error) {
    throw convertWalletError(error)
  }
}

async function disConnect() {
  try {
    store.dispatch('updateWallet', {
      name: WalletName.MetaMask,
      connected: false,
      address: null
    })
    sessionStorage.setItem(META_MASK_CONNECTED_KEY, 'false')
  } catch (error) {
    throw convertWalletError(error)
  }
}

async function changeChain(waitChainId, chaindata) {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: waitChainId }]
    })
  } catch (error) {
    console.log('wallet', error)
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: waitChainId,
              chainName: chaindata.name,
              rpcUrls: [chaindata.rpcUrl],
              blockExplorerUrls: [chaindata.chainExplorerUrl],
              nativeCurrency: {
                name: chaindata.symbol,
                symbol: chaindata.symbol, // 2-6 characters long
                decimals: 18
              }
            }
          ]
        })
      } catch (addError) {
        if (addError.code !== -32602) {
          throw convertWalletError(addError)
        } else {
          console.log(addError)
        }
      }
    } else if (error.code !== -32002 && error.code !== -32602) {
      throw convertWalletError(error)
    }
  }
}

async function getBalance({ address }) {
  try {
    const result = await web3.eth.getBalance(address)
    return integerToDecimal(result, 18)
  } catch (error) {
    throw convertWalletError(error)
  }
}

async function getTransactionStatus({ transactionHash }) {
  try {
    const transactionReceipt = await web3.eth.getTransactionReceipt(
      `0x${transactionHash}`
    )
    if (transactionReceipt) {
      return transactionReceipt.status
        ? SingleTransactionStatus.Done
        : SingleTransactionStatus.Failed
    }
    return SingleTransactionStatus.Pending
  } catch (error) {
    throw convertWalletError(error)
  }
}
async function registerNode({
  stakeAddress,
  chainId,
  consensusAddress,
  signerAddress,
  proposalAddress,
  commission,
  desc,
  amount
}) {
  try {
    const chain = store.getters.getChain(chainId)
    const lockContract = new web3.eth.Contract(
      require('@/assets/json/native.json'),
      chain.nativeContractHash
    )
    const amountInt = decimalToInteger(amount, 18)
    const commissionInt = decimalToInteger(commission, 2)
    const result = await confirmLater(
      lockContract.methods
        .createValidator(
          consensusAddress,
          signerAddress,
          proposalAddress,
          commissionInt,
          desc
        )
        .send({
          from: stakeAddress,
          value: amountInt
        })
    )
    return toStandardHex(result)
  } catch (error) {
    throw convertWalletError(error)
  }
}

async function claimReward({ stakeAddress, chainId, consensusAddress }) {
  try {
    const chain = store.getters.getChain(chainId)
    const nativeContract = new web3.eth.Contract(
      require('@/assets/json/native.json'),
      chain.nativeContractHash
    )
    const result = await confirmLater(
      nativeContract.methods.withdrawStakeRewards(consensusAddress).send({
        from: stakeAddress
      })
    )
    return toStandardHex(result)
  } catch (error) {
    throw convertWalletError(error)
  }
}

async function newStake({ stakeAddress, chainId, consensusAddress, amount }) {
  try {
    const chain = store.getters.getChain(chainId)
    const amountInt = decimalToInteger(amount, 18)
    const nativeContract = new web3.eth.Contract(
      require('@/assets/json/native.json'),
      chain.nativeContractHash
    )
    const result = await confirmLater(
      nativeContract.methods.stake(consensusAddress).send({
        from: stakeAddress,
        value: amountInt
      })
    )
    return toStandardHex(result)
  } catch (error) {
    throw convertWalletError(error)
  }
}
async function unStake({
  stakeAddress,
  chainId,
  consensusAddress,
  unstakeAmount
}) {
  try {
    const chain = store.getters.getChain(chainId)
    const amount = decimalToInteger(unstakeAmount, 18)
    const nativeContract = new web3.eth.Contract(
      require('@/assets/json/native.json'),
      chain.nativeContractHash
    )
    const result = await confirmLater(
      nativeContract.methods.unStake(consensusAddress, amount).send({
        from: stakeAddress
      })
    )
    return toStandardHex(result)
  } catch (error) {
    throw convertWalletError(error)
  }
}
async function userWithdraw({ stakeAddress, chainId }) {
  try {
    const chain = store.getters.getChain(chainId)
    const nativeContract = new web3.eth.Contract(
      require('@/assets/json/native.json'),
      chain.nativeContractHash
    )
    const result = await confirmLater(
      nativeContract.methods.withdraw().send({
        from: stakeAddress
      })
    )
    return toStandardHex(result)
  } catch (error) {
    throw convertWalletError(error)
  }
}

export default {
  install: init,
  connect,
  getBalance,
  getTransactionStatus,
  changeChain,
  registerNode,
  claimReward,
  newStake,
  unStake,
  userWithdraw,
  disConnect
}
