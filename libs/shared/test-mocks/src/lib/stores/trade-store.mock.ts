import { signal, WritableSignal } from '@angular/core';
import { OrderBook, OrderBookLevel } from '@exchange-platform/market';

export type MockTradeStore = {
  orderBook: {
    bids: WritableSignal<OrderBookLevel[]>;
    asks: WritableSignal<OrderBookLevel[]>;
    lastUpdateId: WritableSignal<number>;
    timestamp: WritableSignal<number>;
  };
  orderForm: {
    lastPrice: WritableSignal<number>;
    size: WritableSignal<number>;
  };
  balance: WritableSignal<number>;
  loading: WritableSignal<boolean>;
  error: WritableSignal<string>;

  // методы
  setLoading: jest.Mock<void, [boolean]>;
  clearError: jest.Mock<void, []>;
  updateOrderbook: jest.Mock<void, [OrderBook]>;
  updateBalance: jest.Mock<void, [number]>;
  setPrice: jest.Mock<void, [number]>;
  setSize: jest.Mock<void, [number]>;
  setError: jest.Mock<void, [string]>;
};

export function createMockTradeStore(balance = 10_000): MockTradeStore {
  const mockedBalance = signal(balance);
  return {
    orderBook: {
      bids: signal([] as OrderBookLevel[]),
      asks: signal([] as OrderBookLevel[]),
      lastUpdateId: signal(-1),
      timestamp: signal(-1),
    },
    orderForm: {
      lastPrice: signal(10000),
      size: signal(0.1),
    },
    balance: mockedBalance,
    loading: signal(false),
    error: signal(''),
    setLoading: jest.fn(),
    clearError: jest.fn(),
    updateOrderbook: jest.fn(),
    updateBalance: jest
      .fn()
      .mockImplementation((bal: number) => mockedBalance.set(bal)),
    setPrice: jest.fn(),
    setSize: jest.fn(),
    setError: jest.fn(),
  };
}
