export type WalletAddress = string & { __brand: 'WalletAddress' };
export type PublicKey = string & { __brand: 'PublicKey' };
export type ProviderId = 'metamask' | 'phantom';

export enum WalletType {
  EVM = 'EVM',
  SOLANA = 'SOLANA',
  BITCOIN = 'BITCOIN'
}
