import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ExchangeWebsocketPort, WsMarketDataPort } from '@exchange-platform/ports';
import { Candle, CandleInterval, OrderBook, Symbol } from '@exchange-platform/market';
import { BinanceWsDepthLimitMessage, BinanceWsKlineMessage, BinanceWsTickerMessage } from '../types/binance-ws.types';
import { CandleMapper } from '../mappers/candle.mapper';
import { OrderBookMapper } from '../mappers/orderbook.mapper';
import { SymbolMapper } from '../mappers/symbol.mapper';

@Injectable()
export class BinanceWsMarketDataAdapter implements WsMarketDataPort {
  private ws = inject(ExchangeWebsocketPort);

  /**
   * Subscribe to real-time candle updates
   * Stream: <symbol>@kline_<interval>
   */
  subscribeToCandleUpdates(
    symbol: string,
    interval: CandleInterval
  ): Observable<Candle> {
    const stream = `${symbol.toLowerCase()}@kline_${interval}`;

    return this.ws.subscribe<BinanceWsKlineMessage>(stream).pipe(
      map((message) => CandleMapper.fromWsKline(message.k)),
      catchError((error) => {
        const errorMessage =
          error?.message ||
          error?.toString() ||
          'Failed to subscribe to candle updates';
        console.error('Candle stream error:', errorMessage, error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Subscribe to real-time order book updates
   * Stream: <symbol>@depth@100ms or @depth (1000ms)
   */
  subscribeToOrderBookUpdates(
    symbol: string,
    updateSpeed: '100ms' | '1000ms' = '100ms'
  ): Observable<OrderBook> {
    const speedSuffix = updateSpeed === '100ms' ? '@100ms' : '';
    const stream = `${symbol.toLowerCase()}@depth10${speedSuffix}`;

    return this.ws.subscribe<BinanceWsDepthLimitMessage>(stream).pipe(
      map((message) => OrderBookMapper.fromWsLevelDepth(message)),
      catchError((error) => {
        const errorMessage =
          error?.message ||
          error?.toString() ||
          'Failed to subscribe to order book updates';
        console.error('Order book stream error:', errorMessage, error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Subscribe to 24hr ticker updates for a symbol
   * Stream: <symbol>@ticker
   */
  subscribeToTickerUpdates(symbol: string): Observable<Symbol> {
    const stream = `${symbol.toLowerCase()}@ticker`;

    return this.ws.subscribe<BinanceWsTickerMessage>(stream).pipe(
      map((message) => SymbolMapper.fromWsTicker(message)),
      catchError((error) => {
        const errorMessage =
          error?.message ||
          error?.toString() ||
          'Failed to subscribe to ticker updates';
        console.error('Ticker stream error:', errorMessage, error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Subscribe to all market tickers (for market watch)
   * Stream: !ticker@arr
   */
  subscribeToAllTickersUpdates(): Observable<Symbol[]> {
    const stream = '!ticker@arr';

    return this.ws.subscribe<BinanceWsTickerMessage[]>(stream).pipe(
      map((messages) =>
        messages
          .filter((m) => m.s.endsWith('USDT'))
          .map((m) => SymbolMapper.fromWsTicker(m))
      ),
      catchError((error) => {
        const errorMessage =
          error?.message ||
          error?.toString() ||
          'Failed to subscribe to all tickers updates';
        console.error('All tickers stream error:', errorMessage, error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
