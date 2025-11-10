import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Wallet } from '@exchange-platform/wallet';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { AppStore } from '@exchange-platform/state';
import { WALLET_ADAPTERS } from '@exchange-platform/wallet-api';
import {
  WalletsStoragePort,
  WalletStoragePort,
} from '@exchange-platform/ports';

@Injectable({ providedIn: 'root' })
export class RestoreWalletUseCase {
  private readonly _walletStorage = inject(WalletStoragePort);
  private readonly _walletRepository = inject(WalletsStoragePort);
  private readonly _walletAdapters = inject(WALLET_ADAPTERS);
  private readonly _appStore = inject(AppStore);

  execute(): Observable<Wallet> {
    return this._walletStorage.getConnectedWallet().pipe(
      switchMap((wallet) => {
        console.log('--- Connected wallet:', wallet);
        if (!wallet) throw new Error('Wallet not found');
        return fromPromise(this._walletRepository.getWalletById(wallet.id));
      }),
      switchMap((value) => {
        if (!value) throw new Error('Wallet not found');
        const provider = this._walletAdapters.find(
          (adapter) => adapter.getWalletType() === value.type
        );
        if (!provider) throw new Error('Wallet provider not found');
        return provider.connect(value, (acc) => {
          this._appStore.setAccount(acc);
        });
      })
    );
  }
}
