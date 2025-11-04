import { of } from 'rxjs';

export function createMockWsMarketDataPort() {
  return {
    subscribeToCandleUpdates: jest.fn().mockReturnValue(of({ open: 50000, high: 50100, low: 49900, close: 50050, volume: 100, timestamp: Date.now() })),
    subscribeToOrderBookUpdates: jest.fn().mockReturnValue(of({ bids: [], asks: [], lastUpdateId: 0, timestamp: 0 })),
    subscribeToTickerUpdates: jest.fn().mockReturnValue(of({ symbol: 'BTCUSDT', price: 50000 })),
    subscribeToAllTickersUpdates: jest.fn().mockReturnValue(of([]))
  };
}
