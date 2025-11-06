import { Observable } from 'rxjs';
import { Candle, OrderBook, Symbol } from '@exchange-platform/market';
import { CandleInterval } from '@exchange-platform/types';

export abstract class WsMarketDataPort {
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
