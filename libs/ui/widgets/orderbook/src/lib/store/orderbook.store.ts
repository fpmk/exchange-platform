import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, effect, inject, untracked } from '@angular/core';
import { GetOrderBookUseCase } from '@exchange-platform/market-use-cases';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { AppStore } from '@exchange-platform/state';
import { OrderBook, OrderBookLevel } from '@exchange-platform/market';

interface OrderbookState {
  symbol: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  lastUpdateId: number;
  timestamp: number;
  loading: boolean;
  error: string | null;
}

const initialState: OrderbookState = {
  symbol: '',
  bids: [],
  asks: [],
  lastUpdateId: -1,
  timestamp: -1,
  loading: false,
  error: null,
};

export const orderbookStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    hasData: computed(() => store.asks.length > 0 && store.bids.length > 0),
  })),
  withMethods((store, getOrderbookSnapshot = inject(GetOrderBookUseCase)) => {
    return {
      setLoading(isLoading: boolean): void {
        patchState(store, { loading: isLoading });
      },
      setError(error: string | null): void {
        console.error('Error:', error);
        patchState(store, { error, loading: false });
      },
      updateOrderbook(orderbook: OrderBook): void {
        patchState(store, {
          bids: orderbook.bids,
          asks: orderbook.asks,
          lastUpdateId: orderbook.lastUpdateId,
          timestamp: orderbook.timestamp,
        });
      },
      loadOrderbookSnapshot: rxMethod<{ symbol: string; limit: number }>(
        pipe(
          tap(() => patchState(store, { error: null, loading: true })),
          switchMap(({ symbol, limit }) =>
            getOrderbookSnapshot.execute({ symbol, limit }).pipe(
              tapResponse({
                next: (book) => {
                  patchState(store, {
                    symbol,
                    bids: book.bids,
                    asks: book.asks,
                    lastUpdateId: book.lastUpdateId,
                    timestamp: book.timestamp,
                  });
                },
                error: (error: Error) => {
                  console.error('Failed to load orderbook:', error);
                  patchState(store, {
                    error: error.message,
                    loading: false,
                  });
                },
              })
            )
          )
        )
      ),
    };
  }),
  withHooks({
    onInit: (store, appState = inject(AppStore)) => {
      effect(() => {
        const symbol = appState.selectedSymbol();
        untracked(() => {
          store.loadOrderbookSnapshot({ symbol, limit: 20 });
        });
      });
    },
  })
);
