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
  WalletStoragePort,
  WsMarketDataPort,
} from '@exchange-platform/ports';
import {
  BinanceMarketDataAdapter,
  BinanceWebSocketAdapter,
} from '@exchange-platform/binance';
import {
  LocalStorageAdapter,
  WalletStorageAdapter,
} from '@exchange-platform/storage';

// Feature Providers
import { CHART_FEATURE_PROVIDERS } from '@exchange-platform/feature-chart';
import { TradingApiAdapter } from '@exchange-platform/api';
import { walletRepositoriesConfig } from '@exchange-platform/configs';
import { WalletRepositoryImpl } from '../../libs/infrastructure/repositories/src/lib/wallet.repository.impl';
import { WalletRepository } from '@exchange-platform/repositories';
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
      provide: WalletStoragePort,
      useClass: WalletStorageAdapter,
    },
    {
      provide: WalletRepository,
      useClass: WalletRepositoryImpl,
    },
    DetectWalletsUseCase,
    provideAppInitializer(() => {
      const detectWallet = inject(DetectWalletsUseCase);
      return detectWallet.execute();
    }),
    ...walletRepositoriesConfig,
    // {
    //   provide: AccountPort,
    //   useClass: BinanceAccountAdapter
    // },
    // ============================================
    // FEATURE-SPECIFIC PROVIDERS
    // ============================================
    ...CHART_FEATURE_PROVIDERS,
  ],
};
