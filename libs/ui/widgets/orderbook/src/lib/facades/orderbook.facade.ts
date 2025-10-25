import { inject, Injectable } from '@angular/core';
import { GetOrderBookUseCase } from '@exchange-platform/market-use-cases';
import { orderbookStore } from '../store/orderbook.store';
import { take } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

@Injectable()
export class Orderbook {
  private readonly getOrderbookUseCase = inject(GetOrderBookUseCase);
  private readonly orderbookStore = inject(orderbookStore);

  loadOrderbook(symbol: string) {
    this.orderbookStore.setLoading(true);
    this.orderbookStore.setError(null);
    this.getOrderbookUseCase.execute({ symbol, limit: 20 }).pipe(
      take(1),
      tapResponse({
        next: (orderbook) => {},
        error: (error: Error) => {},
      })
    );
  }
}
