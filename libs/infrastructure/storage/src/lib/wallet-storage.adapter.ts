import { Observable } from 'rxjs';
import { Wallet } from '@exchange-platform/wallet';
import { StoragePort, WalletStoragePort } from '@exchange-platform/ports';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WalletStorageAdapter implements WalletStoragePort {
  private readonly _storage = inject(StoragePort);
  private readonly STORAGE_KEY = 'connected-wallet';

  getConnectedWallet(): Observable<Wallet | null> {
    return this._storage.get<Wallet>(this.STORAGE_KEY);
  }

  saveConnectedWallet(wallet: Wallet): Observable<void> {
    const duplicate = { ...wallet, provider: null };
    return this._storage.set(this.STORAGE_KEY, duplicate);
  }

  clearConnectedWallet(): Observable<void> {
    return this._storage.clear();
  }
}
