import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { MarketDataPort } from '@exchange-platform/ports';
import { Candle, CandleInterval } from '@exchange-platform/market';

export interface GetHistoricalCandlesQuery {
  symbol: string;
  interval: CandleInterval;
  limit?: number;
  startTime?: number;
  endTime?: number;
}

/**
 * Use Case: Get Historical Candles
 * Used for initial chart load
 */
@Injectable({ providedIn: 'root' })
export class GetHistoricalCandlesUseCase {
  private marketDataPort = inject(MarketDataPort);

  execute(query: GetHistoricalCandlesQuery): Observable<Candle[]> {
    console.log('[changeCandleInterval] for symbol', query);
    this.validate(query);

    return this.marketDataPort
      .getCandles(
        query.symbol,
        query.interval,
        query.limit ?? 500,
        query.startTime,
        query.endTime
      )
      .pipe(
        tap((candles) => {
          console.log(`Loaded ${candles.length} candles`);
        })
      );
  }

  private validate(query: GetHistoricalCandlesQuery): void {
    if (!query.symbol) {
      throw new Error('Symbol is required');
    }
    if (!query.interval) {
      throw new Error('Interval is required');
    }
    if (query.limit && query.limit > 50000) {
      throw new Error('Limit cannot exceed 50000');
    }
  }
}
