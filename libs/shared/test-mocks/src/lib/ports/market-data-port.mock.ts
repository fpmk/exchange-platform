import { of } from 'rxjs';

export function createMockMarketDataPort() {
  return {
    getCandles: jest.fn().mockReturnValue(
      of([
        {
          time: Math.floor(Date.now() / 1000),
          open: 111000,
          high: 115000,
          low: 109000,
          close: 112000,
          volume: 10,
        },
      ])
    ),
    getOrderBook: jest.fn().mockReturnValue(
      of({
        bids: [{ price: 110000, quantity: 1, total: 1 }],
        asks: [{ price: 109900, quantity: 1, total: 1 }],
        lastUpdateId: 0,
        timestamp: 0,
      })
    ),
    getSymbols: jest.fn().mockReturnValue(of([])),
    getSymbol: jest
      .fn()
      .mockReturnValue(of({ symbol: 'BTCUSDT', price: 50000 })),
  };
}
