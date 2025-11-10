import { inject, Injectable } from '@angular/core';
import { Wallet } from '@exchange-platform/wallet';
import { AppStore } from '@exchange-platform/state';
import { WALLET_ADAPTERS } from '@exchange-platform/wallet-api';

@Injectable({ providedIn: 'root' })
export class ConnectWalletUseCase {
  private readonly _appStore = inject(AppStore);
  private readonly _walletAdapters = inject(WALLET_ADAPTERS);

  execute(wallet: Wallet): Promise<Wallet> {
    const provider = this._walletAdapters.find(
      (adapter) => adapter.getWalletType() === wallet.type
    );
    if (!provider) throw new Error('Wallet provider not found');
    return provider.connect(wallet, (acc) => {
      this._appStore.setAccount(acc);
    });
  }
}
