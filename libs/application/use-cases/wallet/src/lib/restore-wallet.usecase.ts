import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Wallet } from '@exchange-platform/wallet';
import { WalletStoragePort } from '@exchange-platform/ports';
import { WalletRepository } from '@exchange-platform/repositories';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { AppStore } from '@exchange-platform/state';

@Injectable({ providedIn: 'root' })
export class RestoreWalletUseCase {
  private readonly _walletStorage = inject(WalletStoragePort);
  private readonly _walletRepository = inject(WalletRepository);
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
        return this._walletRepository.connectWallet(value.id, (acc) => {
          this._appStore.setAccount(acc);
        });
      })
    );
  }
}
