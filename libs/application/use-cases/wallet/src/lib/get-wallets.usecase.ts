import { inject, Injectable } from '@angular/core';
import { Wallet } from '@exchange-platform/wallet';
import { WalletRepository } from '@exchange-platform/repositories';

@Injectable({ providedIn: 'root' })
export class GetWalletsUseCase {
  private readonly _walletRepository = inject(WalletRepository);

  async execute(): Promise<Wallet[]> {
    return this._walletRepository.getAvailableWallets();
  }
}
