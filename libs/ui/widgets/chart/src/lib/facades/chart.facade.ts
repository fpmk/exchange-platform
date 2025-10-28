import { DestroyRef, inject, Injectable } from '@angular/core';
import {
  GetHistoricalCandlesUseCase,
  SubscribeToCandlesUseCase,
} from '@exchange-platform/market-use-cases';
import { CandleInterval } from '@exchange-platform/market';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { filter, map, Subscription, take } from 'rxjs';
import { StoragePort } from '@exchange-platform/ports';
import { AppStore, ChartState, ChartStore } from '@exchange-platform/state';

@Injectable()
export class ChartFacade {
  private readonly getHistoricalCandles = inject(GetHistoricalCandlesUseCase);
  private readonly subscribeToCandles = inject(SubscribeToCandlesUseCase);
  private readonly store = inject(ChartStore);
  private readonly appStore = inject(AppStore);
  private readonly storage = inject(StoragePort);
  private readonly destroyRef = inject(DestroyRef);

  private realtimeSubscription: Subscription = Subscription.EMPTY;
  private readonly STORAGE_KEY = 'chart-state';

  constructor() {
    this.restoreInterval();
  }

  loadChart(symbol: string, interval: CandleInterval): void {
    this.store.setLoading(true);
    this.stopRealtimeUpdates();

    this.getHistoricalCandles
      .execute({ symbol, interval, limit: 50000 })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        take(1),
        tapResponse({
          next: (candles) => {
            this.store.setCandles(candles);
            this.startRealtimeUpdates(symbol, interval);
          },
          error: (error: Error) => this.store.setError(error.message),
        })
      )
      .subscribe();
  }

  changeCandleInterval(interval: CandleInterval): void {
    const symbol = this.appStore.selectedSymbol();
    if (symbol) {
      this.saveInterval(interval);
      this.loadChart(symbol, interval);
    }
  }

  private startRealtimeUpdates(symbol: string, interval: CandleInterval): void {
    this.realtimeSubscription = this.subscribeToCandles
      .execute({ symbol, interval })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (candle) => this.store.updateCandle(candle),
        error: (error) => this.store.setError(error.message),
      });
  }

  private stopRealtimeUpdates(): void {
    if (this.realtimeSubscription) {
      this.realtimeSubscription.unsubscribe();
    }
  }

  private restoreInterval() {
    this.storage
      .get<ChartState>(this.STORAGE_KEY)
      .pipe(
        filter((val: ChartState | null) => val !== null),
        map((res) => {
          if (res.interval) {
            this.store.setCandleInterval(res.interval);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private saveInterval(interval: CandleInterval): void {
    this.storage
      .set(this.STORAGE_KEY, interval)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
