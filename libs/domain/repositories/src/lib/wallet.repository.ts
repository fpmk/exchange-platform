import { Wallet, WalletAccount } from '@exchange-platform/wallet';

export abstract class WalletRepository {
  abstract getAvailableWallets(): Promise<Wallet[]>;

  abstract getWalletById(id: string): Promise<Wallet | null>;

  abstract connectWallet(
    walletId: string,
    onAccountChange: (acc: WalletAccount) => void
  ): Promise<Wallet>;

  abstract disconnectWallet(walletId: string): Promise<void>;

  abstract addWallet(wallet: Wallet): void;

  abstract removeWallet(walletId: string): void;
}
