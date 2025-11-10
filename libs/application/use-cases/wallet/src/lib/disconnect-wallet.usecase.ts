import { inject, Injectable } from '@angular/core';
import { Wallet } from '@exchange-platform/wallet';
import { WALLET_ADAPTERS } from '@exchange-platform/wallet-api';

@Injectable({ providedIn: 'root' })
export class DisconnectWalletUseCase {
  private readonly _walletAdapters = inject(WALLET_ADAPTERS);

  execute(wallet: Wallet): Promise<void> {
    const provider = this._walletAdapters.find(
      (adapter) => adapter.getWalletType() === wallet.type
    );
    if (!provider) throw new Error('Wallet provider not found');
    return provider.disconnect(wallet);
  }
}
