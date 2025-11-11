import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { appRoutes } from './app.routes';
import {
  ExchangeWebsocketPort,
  MarketDataPort,
  StoragePort,
  TradingPort,
  WalletsStoragePort,
  WalletStoragePort,
  WsMarketDataPort,
} from '@exchange-platform/ports';
import {
  BinanceMarketDataAdapter,
  BinanceWebSocketAdapter,
} from '@exchange-platform/binance';
import {
  LocalStorageAdapter,
  WalletsStorageAdapter,
  WalletStorageAdapter,
} from '@exchange-platform/storage';

// Feature Providers
import { CHART_FEATURE_PROVIDERS } from '@exchange-platform/feature-chart';
import { WALLET_ADAPTER_PROVIDERS } from '@exchange-platform/configs';
import { TradingApiAdapter } from '@exchange-platform/api';
import { DetectWalletsUseCase } from '@exchange-platform/wallet-use-cases';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideHttpClient(),
    // ============================================
    // SHARED INFRASTRUCTURE (Exchange Adapters)
    // ============================================
    {
      provide: ExchangeWebsocketPort,
      useClass: BinanceWebSocketAdapter, // ← Switch to Bybit here
    },
    {
      provide: MarketDataPort,
      useClass: BinanceMarketDataAdapter, // ← Switch to Bybit here
    },
    {
      provide: WsMarketDataPort,
      useClass: BinanceMarketDataAdapter, // ← Switch to Bybit here
    },
    {
      provide: StoragePort,
      useClass: LocalStorageAdapter,
    },
    {
      provide: TradingPort,
      useClass: TradingApiAdapter,
    },
    {
      provide: WalletsStoragePort,
      useClass: WalletsStorageAdapter,
    },
    {
      provide: WalletStoragePort,
      useClass: WalletStorageAdapter,
    },
    DetectWalletsUseCase,
    provideAppInitializer(() => {
      const detectWallet = inject(DetectWalletsUseCase);
      return detectWallet.execute();
    }),
    ...WALLET_ADAPTER_PROVIDERS,
    ...CHART_FEATURE_PROVIDERS,
  ],
};
