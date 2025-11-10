import { Wallet, WalletAccount } from '@exchange-platform/wallet';
import { WalletType } from '@exchange-platform/types';

export interface WalletPort {
  getWalletType(): WalletType;

  connect(
    wallet: Wallet,
    onAccountChange: (acc: WalletAccount) => void
  ): Promise<Wallet>;

  disconnect(wallet: Wallet): Promise<void>;

  signMessage(wallet: Wallet, message: string): Promise<string>;
}
