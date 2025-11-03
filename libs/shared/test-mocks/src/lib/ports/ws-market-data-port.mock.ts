import { of } from 'rxjs';

export function createMockWsMarketDataPort() {
  return {
    subscribeToCandleUpdates: jest.fn().mockReturnValue(of({})),
    subscribeToOrderBookUpdates: jest
      .fn()
      .mockReturnValue(of({ bids: [], asks: [] })),
    subscribeToTickerUpdates: jest.fn().mockReturnValue(of({})),
    subscribeToAllTickersUpdates: jest.fn().mockReturnValue(of([])),
  };
}
