import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed } from '@angular/core';
import { OrderBook, OrderBookLevel } from '@exchange-platform/market';

export interface OrderbookState {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  lastUpdateId: number;
  timestamp: number;
}

export interface OrderFormState {
  lastPrice: number;
  size: number;
}

export interface TradeState {
  orderBook: OrderbookState;
  orderForm: OrderFormState; // todo, maybe move to local store in order form component
  loading: boolean;
  error: string | null;
  balance: number; // todo move to separate page local store
}

const initialState: TradeState = {
  orderBook: {
    bids: [],
    asks: [],
    lastUpdateId: -1,
    timestamp: -1,
  },
  orderForm: {
    lastPrice: 0,
    size: 0,
  },
  balance: 0,
  loading: false,
  error: null,
};

export const TradeStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    hasData: computed(
      () => store.orderBook.asks.length > 0 && store.orderBook.bids.length > 0
    ),
  })),
  withMethods((store) => {
    return {
      setLoading(isLoading: boolean): void {
        patchState(store, { loading: isLoading });
      },
      setError(error: string | null): void {
        console.error('Error:', error);
        patchState(store, { error, loading: false });
      },
      clearError(): void {
        patchState(store, { error: null, loading: false });
      },
      setPrice(price: number): void {
        patchState(store, {
          orderForm: {
            ...store.orderForm(),
            lastPrice: price,
          },
        });
      },
      setSize(size: number): void {
        patchState(store, {
          orderForm: {
            ...store.orderForm(),
            size,
          },
        });
      },
      updateOrderbook(orderbook: OrderBook): void {
        patchState(store, {
          orderBook: {
            bids: orderbook.bids,
            asks: orderbook.asks,
            lastUpdateId: orderbook.lastUpdateId,
            timestamp: orderbook.timestamp,
          },
        });
      },
      updateBalance(balance: number): void {
        patchState(store, { balance });
      },
    };
  })
);
