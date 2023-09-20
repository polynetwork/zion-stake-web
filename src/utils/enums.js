/* eslint-disable */
import { TARGET_MAINNET } from '@/utils/env';

export const WalletName = {
  MetaMask: 'MetaMask',
  WalletConnect: 'WalletConnnect',
};

export const ChainId = {
  Poly: 0,
  Eth: 2,
  Zion: 3
};

export const NetworkChainIdMaps = {
  [TARGET_MAINNET ? 1 : 3]: ChainId.Eth,
  [TARGET_MAINNET ? 60803 : 60803]: ChainId.Zion,
};

export const EthNetworkChainIdMaps = {
  [ChainId.Eth]: TARGET_MAINNET ? 1 : 3,
  [ChainId.Zion]: TARGET_MAINNET ? 60803 : 60803,
};

export const SingleTransactionStatus = {
  Failed: -1,
  Pending: 1,
  Done: 2,
};

export const TransactionStatus = {
  Failed: -1,
  Finished: 0,
  Pending: 1,
  SourceDone: 2,
  SourceConfirmed: 3,
  PolyConfirmed: 4,
  FromchainFeePending: 11,
};
