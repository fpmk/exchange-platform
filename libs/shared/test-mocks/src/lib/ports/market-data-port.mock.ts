import { of } from 'rxjs';

export function createMockMarketDataPort() {
  return {
    getCandles: jest.fn().mockReturnValue(of([])),
    getOrderBook: jest.fn().mockReturnValue(of({ bids: [], asks: [] })),
    getSymbols: jest.fn().mockReturnValue(of([])),
    getSymbol: jest.fn().mockReturnValue(of({}))
  };
}
