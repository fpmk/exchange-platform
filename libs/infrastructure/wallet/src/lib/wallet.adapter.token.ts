import { InjectionToken } from '@angular/core';
import { WalletPort } from '@exchange-platform/ports';

export const WALLET_ADAPTERS = new InjectionToken<WalletPort[]>(
  'WALLET_ADAPTERS'
);
