import { Wallet, WalletAccount } from '@exchange-platform/wallet';

export interface WalletPort {
  connect(wallet: Wallet, onAccountChange: (acc: WalletAccount) => void): Promise<Wallet>;

  disconnect(wallet: Wallet): Promise<void>;

  signMessage(wallet: Wallet, message: string): Promise<string>;
}
