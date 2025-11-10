import { inject, Injectable } from '@angular/core';
import { WINDOW } from '@exchange-platform/platform';
import {
  WalletProvider,
  AnnounceWalletProviderEvent,
  WalletProviderDetail,
  WalletProviderInfo,
  WalletType,
} from '@exchange-platform/types';
import { Wallet } from '@exchange-platform/wallet';
import { WalletsStoragePort } from '@exchange-platform/ports';

@Injectable({
  providedIn: 'root',
})
export class WalletDetectorService {
  private readonly _window = inject(WINDOW);
  private readonly _walletRepository = inject(WalletsStoragePort);
  private _wallets: Wallet[] = [];
  private _isEIP6963Initialized = false;

  constructor() {
    this.initializeEIP6963();
  }

  detectAllWallets(): Promise<Wallet[]> {
    return new Promise((resolve) => {
      if (!this._isEIP6963Initialized) {
        resolve(this._wallets);
        return;
      }

      setTimeout(() => {
        resolve([...this._wallets]);
      }, 100);
    });
  }

  private initializeEIP6963(): void {
    if (this._isEIP6963Initialized) return;
    if (typeof this._window === 'undefined') return;
    this._window.addEventListener('eip6963:announceProvider', (e) =>
      this.onProviderAnnouncedEvent(e as AnnounceWalletProviderEvent)
    );
    this._wallets = [];
    window.dispatchEvent(new Event('eip6963:requestProvider'));
    this._isEIP6963Initialized = true;
  }

  private onProviderAnnouncedEvent(event: AnnounceWalletProviderEvent) {
    const wallet = this.createWallet(event.detail);
    if (this._wallets.find((w) => w.id === wallet.id)) return;
    this._wallets.push(wallet);
    this._walletRepository.addWallet(wallet);
  }

  private createWallet(providerDetail: WalletProviderDetail): Wallet {
    const { info, provider } = providerDetail;

    const walletType = this.detectWalletType(info);
    return new Wallet(
      info.name,
      info.name,
      info.icon,
      walletType,
      provider as WalletProvider,
      false,
      null
    );
  }

  private detectWalletType(info: WalletProviderInfo): WalletType {
    if (info.rdns && info.rdns.includes('solana')) {
      return WalletType.SOLANA;
    }
    return WalletType.EVM;
  }
}
