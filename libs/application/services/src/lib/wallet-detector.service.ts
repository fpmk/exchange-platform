import { inject, Injectable } from '@angular/core';
import { WINDOW } from '@exchange-platform/platform';
import {
  EIP1193Provider,
  EIP6963AnnounceProviderEvent,
  EIP6963ProviderDetail,
  EIP6963ProviderInfo,
  WalletType,
} from '@exchange-platform/types';
import { Wallet } from '@exchange-platform/wallet';
import { WalletRepository } from '@exchange-platform/repositories';

@Injectable({
  providedIn: 'root',
})
export class WalletDetectorService {
  private readonly _window = inject(WINDOW);
  private readonly _walletRepository = inject(WalletRepository);
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
      this.onProviderAnnouncedEvent(e as EIP6963AnnounceProviderEvent)
    );
    this._wallets = [];
    window.dispatchEvent(new Event('eip6963:requestProvider'));
    this._isEIP6963Initialized = true;
  }

  private onProviderAnnouncedEvent(event: EIP6963AnnounceProviderEvent) {
    const wallet = this.createWallet(event.detail);
    if (this._wallets.find((w) => w.id === wallet.id)) return;
    this._wallets.push(wallet);
    this._walletRepository.addWallet(wallet);
  }

  private createWallet(providerDetail: EIP6963ProviderDetail): Wallet {
    const { info, provider } = providerDetail;

    const walletType = this.detectWalletType(info);
    return new Wallet(
      info.name,
      info.name,
      info.icon,
      walletType,
      provider as EIP1193Provider,
      false,
      null
    );
  }

  private detectWalletType(info: EIP6963ProviderInfo): WalletType {
    if (info.rdns && info.rdns.includes('solana')) {
      return WalletType.SOLANA;
    }
    return WalletType.EVM;
  }
}
