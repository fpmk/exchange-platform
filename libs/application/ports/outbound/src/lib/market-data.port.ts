import { Observable } from 'rxjs';
import { Candle, OrderBook, Symbol } from '@exchange-platform/market';
import { CandleInterval } from '@exchange-platform/types';

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
}
