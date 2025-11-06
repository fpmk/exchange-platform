import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { WalletConnectFacade } from '../facades/wallet-connect.facade';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Wallet } from '@exchange-platform/wallet';
import { MaskAddressPipe } from '@exchange-platform/pipes';
import { SafePipe } from '@exchange-platform/shared-pipes';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AppStore } from '@exchange-platform/state';

@Component({
  selector: 'lib-wallet-connect',
  imports: [MaskAddressPipe, SafePipe, AsyncPipe],
  providers: [WalletConnectFacade],
  templateUrl: './wallet-connect.html',
  styleUrl: './wallet-connect.css',
})
export class WalletConnect implements OnInit {
  protected wallets$!: Observable<Wallet[]>;
  protected readonly appStore = inject(AppStore);
  private readonly _facade = inject(WalletConnectFacade);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _currentWalletId = signal<string>('');

  ngOnInit(): void {
    this.wallets$ = this._facade.availableWallets();
    this._facade
      .recoverLastConnection()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((wallet) => {
        this._currentWalletId.set(wallet.id);
        this.appStore.setAccount(wallet.account);
      });
  }

  connectWallet(walletId: string) {
    this._facade
      .connect(walletId)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((wallet) => {
        this._currentWalletId.set(wallet.id);
        this.appStore.setAccount(wallet.account);
      });
  }

  disconnectWallet() {
    this._facade
      .disconnect(this._currentWalletId())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
