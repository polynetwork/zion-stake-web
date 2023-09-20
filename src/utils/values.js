/* eslint-disable */
import { WalletName, ChainId } from './enums';
import { TARGET_MAINNET } from './env';

export const HTTP_BASE_URL = TARGET_MAINNET
  ? 'http://43.163.232.177:8086'
  : 'http://43.163.232.177:8086';


export const WALLETS = [
  {
    name: WalletName.MetaMask,
    supportedChainIds: [
      ChainId.Eth,
      ChainId.Zion,
    ],
    icon: require('@/assets/img/svg/meta-mask.svg'),
    downloadUrl:
      'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
  },
  // ...(TARGET_MAINNET
  //   ? [
  {
    name: WalletName.WalletConnect,
    supportedChainIds: [ChainId.Eth],
    icon: require('@/assets/img/svg/wallet-connect.svg'),
    downloadUrl: 'https://walletconnect.org/wallets',
  },
];

export const MAIN_CHAINS = [
  {
    id: ChainId.Poly,
    explorerUrl: TARGET_MAINNET
      ? 'http://explorer.poly.network/tx/{txHash}'
      : 'http://explorer.poly.network/testnet/tx/{txHash}',
    nftexplorerUrl: TARGET_MAINNET
      ? 'http://explorer.poly.network/nfttx/{txHash}'
      : 'http://explorer.poly.network/testnet/nfttx/{txHash}',
  },
  {
    id: ChainId.Eth,
    nativeFee: true,
    icon: require('@/assets/img/svg/eth.svg'),
    explorerUrl: TARGET_MAINNET
      ? 'https://etherscan.io/tx/0x{txHash}'
      : 'https://ropsten.etherscan.io/tx/0x{txHash}',
    nftFeeContractHash: '0000000000000000000000000000000000000000',
    symbol: 'ETH',
    name: TARGET_MAINNET ? 'Ethereum Mainnet' : 'Ropsten TestNet',
    rpcUrl: TARGET_MAINNET ? 'https://mainnet.infura.io/v3/' : 'https://ropsten.infura.io/v3/',
    chainExplorerUrl: TARGET_MAINNET ? 'https://etherscan.io/' : 'https://ropsten.etherscan.io/',
    selfPay: true,
  },
  {
    id: ChainId.Zion,
    nativeFee: true,
    icon: require('@/assets/img/svg/zion.svg'),
    explorerUrl: TARGET_MAINNET
      ? 'http://explorer.zion.network/testnet/tx/0x{txHash}'
      : 'http://explorer.zion.network/testnet/tx/0x{txHash}',
    nftFeeContractHash: '0000000000000000000000000000000000000000',
    nativeContractHash: '0000000000000000000000000000000000001000',
    symbol: 'Zion',
    name: TARGET_MAINNET ? 'Zion Mainnet' : 'Zion TestNet',
    rpcUrl: TARGET_MAINNET ? 'http://101.32.99.70:22000' : 'http://101.32.99.70:22000',
    chainExplorerUrl: TARGET_MAINNET ? 'http://explorer.zion.network/testnet/' : 'http://explorer.zion.network/testnet/',
    selfPay: true,
  },
];

export const TEST_CHAINS = [
];

export const CHAINS = TARGET_MAINNET ? MAIN_CHAINS : MAIN_CHAINS.concat(TEST_CHAINS);

export const DEFAULT_TOKEN_BASIC_NAME = 'USDT';
export const DEFAULT_CHAIN_NAME = 'ETH';

export const TOP_TOKEN_BASIC_NAMES = ['NEO', 'BNEO', 'ETH', 'USDT', 'USDC', 'DAI'];
