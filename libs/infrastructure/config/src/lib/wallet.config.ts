import { Provider } from '@angular/core';
import {
  EthereumWalletAdapter,
  WALLET_ADAPTERS,
} from '@exchange-platform/wallet-api';

export const WALLET_ADAPTER_PROVIDERS: Provider[] = [
  {
    provide: WALLET_ADAPTERS,
    useClass: EthereumWalletAdapter,
    multi: true,
  },
];
