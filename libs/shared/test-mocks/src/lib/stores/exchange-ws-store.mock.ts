import { signal } from '@angular/core';

export function createMockExchangeWsStore() {
  return {
    status: signal('disconnected'),
    error: signal(null),
    connectedAt: signal(null),
    reconnectAttempts: signal(0),
    lastDisconnectReason: signal(null),
    isConnected: jest.fn().mockReturnValue(true),
    isConnecting: jest.fn().mockReturnValue(false),
  };
}
