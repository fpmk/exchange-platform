import { DestroyRef, inject, Injectable } from '@angular/core';
import {
  GetOrderBookUseCase,
  SubscribeToOrderBookUseCase,
} from '@exchange-platform/market-use-cases';
import { Subscription, take } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TradeStore } from '@exchange-platform/state';

@Injectable()
export class OrderBookFacade {
  private readonly getOrderbook = inject(GetOrderBookUseCase);
  private readonly subscribeToOrderbook = inject(SubscribeToOrderBookUseCase);
  private readonly tradeStore = inject(TradeStore);
  private readonly destroyRef = inject(DestroyRef);
  private realtimeSubscription: Subscription = Subscription.EMPTY;
  private readonly maxOrderBookCount = 10;

  loadOrderbook(symbol: string) {
    this.tradeStore.setLoading(true);
    this.tradeStore.clearError();
    this.stopRealtimeUpdates();
    this.getOrderbook
      .execute({ symbol, limit: this.maxOrderBookCount })
      .pipe(
        take(1),
        tapResponse({
          next: (orderBook) => {
            this.tradeStore.updateOrderbook(orderBook);
            this.tradeStore.setPrice(orderBook.asks[0].price);
            this.startRealtimeUpdates(symbol);
          },
          error: (error: Error) => {
            this.tradeStore.setError(error.message);
          },
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private stopRealtimeUpdates(): void {
    if (this.realtimeSubscription) {
      this.realtimeSubscription.unsubscribe();
    }
  }

  private startRealtimeUpdates(symbol: string): void {
    this.realtimeSubscription = this.subscribeToOrderbook
      .execute({ symbol })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orderBook) => {
          this.tradeStore.updateOrderbook(orderBook);
        },
        error: (error) => this.tradeStore.setError(error.message),
      });
  }
}
