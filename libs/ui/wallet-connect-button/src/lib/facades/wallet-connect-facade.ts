import { inject, Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { WalletConnect } from '@exchange-platform/wallet-connect';

@Injectable()
export class WalletConnectFacade {
  private readonly _overlay = inject(Overlay);

  async connectWallet() {
    const overlayRef = this._overlay.create({
      hasBackdrop: true,
      disposeOnNavigation: true,
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay.position().global().right('0'),
    });
    const component = new ComponentPortal(WalletConnect);
    overlayRef.attach(component);
    overlayRef.backdropClick().subscribe(() => overlayRef.detach());
  }
}
