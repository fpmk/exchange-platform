import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Candle, CandleInterval } from '@exchange-platform/market';

export interface ChartState {
  candles: Candle[];
  interval: CandleInterval;
  loading: boolean;
  error: string | null;
  lastUpdate: number | null;
}

const initialState: ChartState = {
  candles: [],
  interval: '1h',
  loading: false,
  error: null,
  lastUpdate: null,
};

/**
 * Chart store
 */
export const ChartStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((store) => ({
    hasData: computed(() => store.candles().length > 0),
    candleCount: computed(() => store.candles().length),
    lastCandle: computed(() => {
      const candles = store.candles();
      return candles[candles.length - 1] || null;
    }),
    lastTwoCandles: computed(() => {
      const candles = store.candles();
      return {
        prev: candles[candles.length - 2] || null,
        current: candles[candles.length - 1] || null,
      };
    }),
    priceRange: computed(() => {
      const candles = store.candles();
      if (candles.length === 0) return { min: 0, max: 0 };
      const prices = candles.map((c) => [c.high, c.low]).flat();
      return {
        min: Math.min(...prices),
        max: Math.max(...prices),
      };
    }),
  })),

  withMethods((store) => {
    return {
      setCandles(candles: Candle[]): void {
        patchState(store, {
          candles,
          loading: false,
          error: null,
          lastUpdate: Date.now(),
        });
      },

      updateCandle(candle: Candle): void {
        const currentCandles = store.candles();
        const lastCandle = currentCandles[currentCandles.length - 1];

        if (lastCandle && lastCandle.time === candle.time) {
          const updated = [...currentCandles];
          if (updated.length > 1) {
            updated[updated.length - 2] = updated[updated.length - 1];
          }
          updated[updated.length - 1] = candle;
          patchState(store, {
            candles: updated,
            lastUpdate: Date.now(),
          });
        } else {
          patchState(store, {
            candles: [...currentCandles, candle],
            lastUpdate: Date.now(),
          });
        }
      },

      setLoading(isLoading: boolean): void {
        patchState(store, { loading: isLoading });
      },

      setError(error: string | null): void {
        console.error('Error:', error);
        patchState(store, { error, loading: false });
      },

      setCandleInterval(interval: CandleInterval): void {
        patchState(store, { interval });
      },

      clear(): void {
        patchState(store, {
          candles: [],
          loading: false,
          error: null,
          lastUpdate: null,
        });
      },
    };
  })
);
