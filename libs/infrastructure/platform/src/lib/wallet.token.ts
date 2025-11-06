import { InjectionToken } from '@angular/core';
import { WalletPort } from '@exchange-platform/ports';

export const WALLET_REPOSITORIES = new InjectionToken<WalletPort[]>(
  'WALLET_REPOSITORIES'
);
