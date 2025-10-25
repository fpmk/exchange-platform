import { Observable } from 'rxjs';
import {
  Candle,
  CandleInterval,
  OrderBook,
  Symbol,
} from '@exchange-platform/market';

/**
 * Port для рыночных данных
 * Infrastructure слой должен реализовать этот интерфейс
 */
export abstract class MarketDataPort {
  // REST API
  abstract getCandles(
    symbol: string,
    interval: CandleInterval,
    limit?: number,
    startTime?: number,
    endTime?: number
  ): Observable<Candle[]>;

  abstract getOrderBook(symbol: string, limit?: number): Observable<OrderBook>;

  abstract getSymbols(): Observable<Symbol[]>;

  abstract getSymbol(symbol: string): Observable<Symbol>;

  // WebSocket Streams
  abstract subscribeToCandleUpdates(
    symbol: string,
    interval: CandleInterval
  ): Observable<Candle>;

  abstract subscribeToOrderBookUpdates(
    symbol: string,
    updateSpeed?: '100ms' | '1000ms'
  ): Observable<OrderBook>;

  abstract subscribeToTickerUpdates(symbol: string): Observable<Symbol>;

  abstract subscribeToAllTickersUpdates(): Observable<Symbol[]>;
}
