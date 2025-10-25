import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { appRoutes } from './app.routes';

// Ports (Abstractions)
import { MarketDataPort, StoragePort, WebSocketPort } from '@exchange-platform/ports';
import { BinanceMarketDataAdapter, BinanceWebSocketAdapter } from '@exchange-platform/binance';
import { LocalStorageAdapter } from '@exchange-platform/storage';

/**
 * Application Configuration
 *
 * 🎯 This is the ONLY place that knows about specific implementations (Binance)
 *
 * To switch to Bybit:
 * 1. Import BybitMarketDataAdapter, BybitWebSocketAdapter
 * 2. Change useClass below
 * 3. Done! ✅
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),

    // DEPENDENCY INJECTION (Clean Architecture)
    // Core depends on Ports (abstractions), not Adapters (implementations)
    {
      provide: WebSocketPort,
      useClass: BinanceWebSocketAdapter,
    },
    {
      provide: MarketDataPort,
      useClass: BinanceMarketDataAdapter,
    },

    // TODO: Trading & Account adapters
    // {
    //   provide: TradingPort,
    //   useClass: BinanceTradingAdapter
    // },
    // {
    //   provide: AccountPort,
    //   useClass: BinanceAccountAdapter
    // },

    {
      provide: StoragePort,
      useClass: LocalStorageAdapter,
    },
  ],
};
