import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { MarketDataPort } from '@exchange-platform/ports';
import { OrderBook } from '@exchange-platform/market';

export interface GetOrderBookQuery {
  symbol: string;
  limit?: number;
}

/**
 * Use Case: Get Order Book Snapshot
 */
@Injectable({ providedIn: 'root' })
export class GetOrderBookUseCase {
  private marketDataPort = inject(MarketDataPort);

  execute(query: GetOrderBookQuery): Observable<OrderBook> {
    console.log(`Loading order book: ${query.symbol}`);

    return this.marketDataPort
      .getOrderBook(query.symbol, query.limit ?? 10)
      .pipe(
        tap((orderbook) => {
          console.log(`Order book loaded:`, {
            bids: orderbook.bids.length,
            asks: orderbook.asks.length,
            spread: orderbook.asks[0]?.price - orderbook.bids[0]?.price,
          });
        })
      );
  }
}
