import { signal } from '@angular/core';

export function createMockAppStore() {
  return {
    selectSymbol: jest.fn(),
    connectedAccount: jest.fn(),
    selectedSymbol: signal('BTCUSDT'),
    theme: signal('dark' as 'dark' | 'light'),
    isInitialized: signal(true),
    markAsInitialized: jest.fn(),
    setTheme: jest.fn(),
    setAddress: jest.fn(),
    setAccount: jest.fn(),
  };
}
