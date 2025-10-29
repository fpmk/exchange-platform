import { signal } from '@angular/core';

export function createMockTradeStore() {
  return {
    orderBook: {
      bids: signal([]),
      asks: signal([]),
    },
    orderForm: {
      lastPrice: signal(10000),
      size: signal(0.1),
    },
    setLoading: jest.fn(),
    clearError: jest.fn(),
    updateOrderbook: jest.fn(),
    setPrice: jest.fn(),
    setError: jest.fn(),
  };
}

