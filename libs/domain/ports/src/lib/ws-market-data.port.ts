import { Observable } from 'rxjs';
import {
  Candle,
  CandleInterval,
  OrderBook,
  Symbol,
} from '@exchange-platform/market';

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
