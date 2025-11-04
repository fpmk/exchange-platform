import { of } from 'rxjs';

export function createMockExchangeWebsocketPort() {
  return {
    connect: jest.fn().mockReturnValue(of({ status: 'connected', timestamp: Date.now() })),
    disconnect: jest.fn(),
    subscribe: jest.fn().mockReturnValue(of({})),
    unsubscribe: jest.fn(),
    getConnectionStatus: jest.fn().mockReturnValue(of('connected')),
  };
}
