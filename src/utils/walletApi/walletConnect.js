/* eslint-disable */
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import store from '@/store';
import { getChainApi } from '@/utils/chainApi';
import { integerToDecimal, decimalToInteger, toStandardHex } from '@/utils/convertors';
import { WalletName, ChainId, SingleTransactionStatus } from '@/utils/enums';
import { WalletError } from '@/utils/errors';
import { TARGET_MAINNET } from '@/utils/env';
import { tryToConvertAddressToHex } from '.';

const NFT_FEE_TOKEN_HASH = '0x0000000000000000000000000000000000000000';

const NETWORK_CHAIN_ID_MAPS = {
  [TARGET_MAINNET ? 1 : 3]: ChainId.Eth,
};

let provider;
let web3;

function confirmLater(promise) {
  return new Promise((resolve, reject) => {
    promise.on('transactionHash', resolve);
    promise.on('error', reject);

    function onConfirm(confNumber, receipt) {
      promise.off('confirmation', onConfirm);
    }
    promise.on('confirmation', onConfirm);
  });
}

function convertWalletError(error) {
  if (error instanceof WalletError) {
    return error;
  }
  let code = WalletError.CODES.UNKNOWN_ERROR;
  if (error.message.includes('User closed modal')) {
    code = WalletError.CODES.USER_REJECTED;
  }
  if (error.message.includes('User rejected the transaction')) {
    code = WalletError.CODES.USER_REJECTED;
  }
  return new WalletError(error.message, { code, cause: error });
}

async function queryState() {
  const accounts = await provider.request({ method: 'eth_accounts' });
  const address = accounts[0] || null;
  const addressHex = await tryToConvertAddressToHex(WalletName.WalletConnect, address);
  const checksumAddress = address && web3.utils.toChecksumAddress(address);
  const network = await provider.request({ method: 'eth_chainId' });
  store.dispatch('updateWallet', {
    name: WalletName.WalletConnect,
    address: checksumAddress,
    addressHex,
    connected: !!checksumAddress,
    chainId: NETWORK_CHAIN_ID_MAPS[Number(network)],
  });
}

async function setupProvider() {
  provider = new WalletConnectProvider({
    infuraId: '657c0bd9ad0a40a8acabdf8aacef04ed',
    qrcode: true,
    pollingInterval: 15000,
  });
  web3 = new Web3(provider);
  if (provider.wc.connected) {
    await provider.enable();
    if (provider.connected) {
      await queryState();
    }
  }

  const handleAccountsChanged = async accounts => {
    const address = accounts[0] || null;
    const addressHex = await tryToConvertAddressToHex(WalletName.WalletConnect, address);
    const checksumAddress = address && web3.utils.toChecksumAddress(address);
    store.dispatch('updateWallet', {
      name: WalletName.WalletConnect,
      address: checksumAddress,
      addressHex,
      connected: !!checksumAddress,
    });
  };

  const handleChainChanged = network => {
    store.dispatch('updateWallet', {
      name: WalletName.WalletConnect,
      chainId: NETWORK_CHAIN_ID_MAPS[Number(network)],
    });
  };

  provider.on('accountsChanged', handleAccountsChanged);
  provider.on('chainChanged', handleChainChanged);

  provider.on('disconnect', () => {
    provider.stop();
    provider.removeListener('accountsChanged', handleAccountsChanged);
    provider.removeListener('chainChanged', handleChainChanged);

    store.dispatch('updateWallet', {
      name: WalletName.WalletConnect,
      address: null,
      addressHex: null,
      chainId: null,
      connected: false,
    });
  });
}

async function init() {
  try {
    if (!sessionStorage.getItem('walletconnect-inited')) {
      localStorage.removeItem('walletconnect');
      sessionStorage.setItem('walletconnect-inited', 'true');
    }
    store.dispatch('updateWallet', { name: WalletName.WalletConnect, installed: true });
    await setupProvider();
  } finally {
    store.getters.getWallet(WalletName.WalletConnect).deferred.resolve();
  }
}

async function connect() {
  try {
    await setupProvider();
    await provider.enable();
    await queryState();
  } catch (error) {
    throw convertWalletError(error);
  }
}

async function getBalance({ chainId, address, tokenHash }) {
  try {
    const result = await web3.eth.getBalance(address);
    return integerToDecimal(result, tokenBasic.decimals);
  } catch (error) {
    throw convertWalletError(error);
  }
}

async function getTransactionStatus({ transactionHash }) {
  try {
    const transactionReceipt = await web3.eth.getTransactionReceipt(`0x${transactionHash}`);
    if (transactionReceipt) {
      return transactionReceipt.status
        ? SingleTransactionStatus.Done
        : SingleTransactionStatus.Failed;
    }
    return SingleTransactionStatus.Pending;
  } catch (error) {
    throw convertWalletError(error);
  }
}



export default {
  install: init,
  connect,
  getBalance,
  getTransactionStatus,
};
