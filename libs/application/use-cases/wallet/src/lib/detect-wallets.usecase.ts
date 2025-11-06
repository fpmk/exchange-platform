import { inject, Injectable } from '@angular/core';
import { Wallet } from '@exchange-platform/wallet';
import { WalletDetectorService } from '@exchange-platform/application-services';

@Injectable({ providedIn: 'root' })
export class DetectWalletsUseCase {
  private readonly _walletDetector = inject(WalletDetectorService);

  execute(): Promise<Wallet[]> {
    return this._walletDetector.detectAllWallets();
  }
}
