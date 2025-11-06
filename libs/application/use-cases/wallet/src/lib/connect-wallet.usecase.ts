import { inject, Injectable } from '@angular/core';
import { Wallet, WalletAccount } from '@exchange-platform/wallet';
import { WalletRepository } from '@exchange-platform/repositories';
import { AppStore } from '@exchange-platform/state';

@Injectable({ providedIn: 'root' })
export class ConnectWalletUseCase {
  private readonly _walletRepository = inject(WalletRepository);
  private readonly _appStore = inject(AppStore);

  execute(walletId: string): Promise<Wallet> {
    return this._walletRepository.connectWallet(walletId, (acc) => {
      this._appStore.setAccount(acc);
    });
  }

  // private readonly _providers = inject(WALLET_REPOSITORIES);
  // private readonly _walletStorage = inject(WalletStoragePort);
  //
  // execute(provider: EIP6963ProviderDetail): Observable<Wallet> {
  //   const prov = this._providers.find(
  //     (prov) => prov.providerId === provider.info.uuid
  //   );
  //   if (!prov) {
  //     throw new Error('Wallet not found');
  //   }
  //   return prov
  //     .connect()
  //     .pipe(tap((wallet) => this._walletStorage.saveConnectedWallet(wallet)));
  // }
}
