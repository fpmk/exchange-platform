import { Wallet } from '@exchange-platform/wallet';
import { Injectable } from '@angular/core';
import { WalletsStoragePort } from '@exchange-platform/ports';

@Injectable({ providedIn: 'root' })
export class WalletsStorageAdapter implements WalletsStoragePort {
  private wallets: Map<string, Wallet> = new Map();

  async getAvailableWallets(): Promise<Wallet[]> {
    return Array.from(this.wallets.values());
  }

  async getWalletById(id: string): Promise<Wallet | null> {
    console.log(this.wallets);
    return this.wallets.get(id) || null;
  }

  addWallet(wallet: Wallet): void {
    this.wallets.set(wallet.id, wallet);
  }

  removeWallet(walletId: string): void {
    this.wallets.delete(walletId);
  }
}
