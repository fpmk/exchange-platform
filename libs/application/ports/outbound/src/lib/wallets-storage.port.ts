import { Wallet } from '@exchange-platform/wallet';

export abstract class WalletsStoragePort {
  abstract getAvailableWallets(): Promise<Wallet[]>;

  abstract getWalletById(id: string): Promise<Wallet | null>;

  abstract addWallet(wallet: Wallet): void;

  abstract removeWallet(walletId: string): void;
}
