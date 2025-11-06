import { inject, Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { WalletConnect } from '@exchange-platform/wallet-connect';
import { RestoreWalletUseCase } from '@exchange-platform/wallet-use-cases';
import { Observable } from 'rxjs';
import { Wallet } from '@exchange-platform/wallet';

@Injectable()
export class WalletButtonConnectFacade {
  private readonly _overlay = inject(Overlay);
  private readonly _restoreWalletUseCase = inject(RestoreWalletUseCase);

  connectWallet() {
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

  recoverLastConnection(): Observable<Wallet> {
    return this._restoreWalletUseCase.execute();
  }
}
