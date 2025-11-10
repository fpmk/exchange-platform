import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  ConnectWalletUseCase,
  DisconnectWalletUseCase,
  GetWalletsUseCase,
  RestoreWalletUseCase,
} from '@exchange-platform/wallet-use-cases';
import { Wallet } from '@exchange-platform/wallet';
import { AppStore } from '@exchange-platform/state';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { WalletStoragePort } from '@exchange-platform/ports';

@Injectable()
export class WalletConnectFacade {
  protected readonly appStore = inject(AppStore);
  private readonly _walletSore = inject(WalletStoragePort);
  private readonly _connectUseCase = inject(ConnectWalletUseCase);
  private readonly _restoreWalletUseCase = inject(RestoreWalletUseCase);
  private readonly _disconnectUseCase = inject(DisconnectWalletUseCase);
  private readonly _getWalletsUseCase = inject(GetWalletsUseCase);

  availableWallets(): Observable<Wallet[]> {
    return fromPromise(this._getWalletsUseCase.execute());
  }

  recoverLastConnection(): Observable<Wallet> {
    return this._restoreWalletUseCase
      .execute()
      .pipe(tap((wallet) => this.appStore.setAccount(wallet.account)));
  }

  connect(wallet: Wallet): Observable<Wallet> {
    return fromPromise(this._connectUseCase.execute(wallet)).pipe(
      tap((wallet) => this.appStore.setAccount(wallet.account)),
      tap((wallet) => this._walletSore.saveConnectedWallet(wallet))
    );
  }

  disconnect(wallet: Wallet): Observable<void> {
    return fromPromise(this._disconnectUseCase.execute(wallet)).pipe(
      tap(() => this.appStore.setAccount(null)),
      tap(() => this._walletSore.clearConnectedWallet())
    );
  }
}
