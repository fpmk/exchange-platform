import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MaskAddressPipe } from '@exchange-platform/pipes';
import { WalletButtonConnectFacade } from '../facades/wallet-button-connect.facade';
import { AppStore } from '@exchange-platform/state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-wallet-connect-button',
  imports: [MaskAddressPipe],
  providers: [WalletButtonConnectFacade],
  templateUrl: './wallet-connect-button.html',
  styleUrl: './wallet-connect-button.css',
})
export class WalletConnectButton implements OnInit {
  protected readonly appStore = inject(AppStore);
  private readonly _walletConnectFacade = inject(WalletButtonConnectFacade);
  private readonly _destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this._walletConnectFacade
      .recoverLastConnection()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((wallet) => {
        this.appStore.setAccount(wallet.account);
      });
  }

  connectWallet() {
    this._walletConnectFacade.connectWallet();
  }
}
