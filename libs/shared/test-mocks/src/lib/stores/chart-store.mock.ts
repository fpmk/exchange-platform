import { signal } from '@angular/core';

export function createMockChartStore() {
  return {
    symbol: signal('BTCUSDT'),
    candles: signal([]),
    interval: signal('1h'),
    loading: signal(false),
    error: signal(null),
    lastUpdate: signal(null),
    lastTwoCandles: signal([]),
    lastCandle: signal(null),
    hasData: signal(false),
    candleCount: signal(0),
    priceRange: signal({ min: 0, max: 0 }),
    updateCandle: jest.fn(),
    setCandles: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    setCandleInterval: jest.fn(),
  };
}
