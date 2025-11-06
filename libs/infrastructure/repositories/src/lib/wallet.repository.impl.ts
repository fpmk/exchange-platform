import { WalletRepository } from '@exchange-platform/repositories';
import { Wallet, WalletAccount } from '@exchange-platform/wallet';
import { Injectable } from '@angular/core';
import { EthereumWalletAdapter } from '@exchange-platform/wallet-api';
import { WalletType } from '@exchange-platform/types';
import { WalletPort } from '@exchange-platform/ports';

@Injectable({ providedIn: 'root' })
export class WalletRepositoryImpl implements WalletRepository {
  private wallets: Map<string, Wallet> = new Map();
  private readonly _walletAdapters: Map<WalletType, WalletPort> = new Map([
    [WalletType.EVM, new EthereumWalletAdapter()],
  ]);

  async getAvailableWallets(): Promise<Wallet[]> {
    return Array.from(this.wallets.values());
  }

  async getWalletById(id: string): Promise<Wallet | null> {
    console.log(this.wallets);
    return this.wallets.get(id) || null;
  }

  connectWallet(
    walletId: string,
    onAccountChange: (acc: WalletAccount) => void
  ): Promise<Wallet> {
    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new Error(`Wallet with id ${walletId} not found`);
    }
    return this.findAdapter(wallet).connect(wallet, onAccountChange);
  }

  disconnectWallet(walletId: string): Promise<void> {
    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new Error(`Wallet with id ${walletId} not found`);
    }
    return this.findAdapter(wallet).disconnect(wallet);
  }

  addWallet(wallet: Wallet): void {
    this.wallets.set(wallet.id, wallet);
  }

  removeWallet(walletId: string): void {
    this.wallets.delete(walletId);
  }

  private findAdapter(wallet: Wallet): WalletPort {
    const adapter = this._walletAdapters.get(wallet.type);
    if (!adapter) {
      throw new Error(`No adapter with type ${wallet.type}`);
    }
    return adapter;
  }
}
