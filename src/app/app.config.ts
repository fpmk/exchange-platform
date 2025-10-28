import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { appRoutes } from './app.routes';

// Ports (Abstractions)
import { MarketDataPort, StoragePort, TradingPort, WebSocketPort } from '@exchange-platform/ports';
import { BinanceMarketDataAdapter, BinanceWebSocketAdapter } from '@exchange-platform/binance';
import { LocalStorageAdapter } from '@exchange-platform/storage';

// Feature Providers
import { CHART_FEATURE_PROVIDERS } from '@exchange-platform/feature-chart';
import { TradingApiAdapter } from '../../libs/infrastructure/api/src/lib/trading-api.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideHttpClient(),

    // ============================================
    // SHARED INFRASTRUCTURE (Exchange Adapters)
    // ============================================
    {
      provide: WebSocketPort,
      useClass: BinanceWebSocketAdapter, // ← Switch to Bybit here
    },
    {
      provide: MarketDataPort,
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
