import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { MarketDataPort } from '@exchange-platform/ports';
import { OrderBook } from '@exchange-platform/market';

export interface SubscribeToOrderBookCommand {
  symbol: string;
  updateSpeed?: '100ms' | '1000ms';
}

/**
 * Use Case: Subscribe to Real-time Order Book Updates
 */
@Injectable({ providedIn: 'root' })
export class SubscribeToOrderBookUseCase {
  private marketDataPort = inject(MarketDataPort);

  execute(command: SubscribeToOrderBookCommand): Observable<OrderBook> {
    console.log(`Subscribing to order book: ${command.symbol}`);

    return this.marketDataPort
      .subscribeToOrderBookUpdates(
        command.symbol,
        command.updateSpeed ?? '100ms'
      )
      .pipe(
        tap((orderbook) => {
          const spread = orderbook.asks[0]?.price - orderbook.bids[0]?.price;
          console.log(`📖 Order book update: spread=${spread.toFixed(2)}`);
        })
      );
  }
}
