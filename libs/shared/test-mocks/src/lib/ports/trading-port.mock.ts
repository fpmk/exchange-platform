import { of } from 'rxjs';

export function createMockTradingPort() {
  return {
    placeOrder: jest.fn().mockReturnValue(of({ id: 'test-order' })),
    cancelOrder: jest.fn(),
    getOrder: jest.fn(),
    getOpenOrders: jest.fn(),
    getAllOrders: jest.fn(),
  };
}
