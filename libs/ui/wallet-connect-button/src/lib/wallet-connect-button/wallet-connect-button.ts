import { Component, inject } from '@angular/core';
import { MaskAddressPipe } from '@exchange-platform/pipes';
import { WalletConnectFacade } from '../facades/wallet-connect-facade';
import { AppStore } from '@exchange-platform/state';

@Component({
  selector: 'lib-wallet-connect-button',
  imports: [MaskAddressPipe],
  providers: [WalletConnectFacade],
  templateUrl: './wallet-connect-button.html',
  styleUrl: './wallet-connect-button.css',
})
export class WalletConnectButton {
  protected readonly appStore = inject(AppStore);
  private readonly _walletConnectFacade = inject(WalletConnectFacade);

  connectWallet() {
    this._walletConnectFacade.connectWallet();
  }
}
