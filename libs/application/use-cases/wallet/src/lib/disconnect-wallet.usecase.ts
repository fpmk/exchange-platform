import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { WALLET_REPOSITORIES } from '@exchange-platform/platform';
import { ProviderId } from '@exchange-platform/types';
import { WalletStoragePort } from '@exchange-platform/ports';
import { WalletRepository } from '@exchange-platform/repositories';
import { Wallet } from '@exchange-platform/wallet';

@Injectable({providedIn: 'root'})
export class DisconnectWalletUseCase {
  private readonly _walletRepository = inject(WalletRepository);

  async execute(walletId: string): Promise<void> {
    return this._walletRepository.disconnectWallet(walletId);
  }

  // private readonly _providers = inject(WALLET_REPOSITORIES);
  // private readonly _walletStorage = inject(WalletStoragePort);
  //
  // execute(providerId: ProviderId): Observable<void> {
  //   const prov = this._providers.find((prov) => prov.providerId === providerId);
  //   if (!prov) {
  //     throw new Error('Wallet not found');
  //   }
  //   return prov
  //     .disconnect()
  //     .pipe(tap((wallet) => this._walletStorage.clearConnectedWallet()));
  // }
}
