import { inject, Injectable } from '@angular/core';
import { Wallet } from '@exchange-platform/wallet';
import { WalletsStoragePort } from '@exchange-platform/ports';

@Injectable({ providedIn: 'root' })
export class GetWalletsUseCase {
  private readonly _walletRepository = inject(WalletsStoragePort);

  async execute(): Promise<Wallet[]> {
    return this._walletRepository.getAvailableWallets();
  }
}
