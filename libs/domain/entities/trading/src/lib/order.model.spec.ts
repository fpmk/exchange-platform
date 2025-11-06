import { Order } from './order.model';

describe('Order entity', () => {
  it('should be valid order', async () => {
    const order = new Order('1', '1', 'BTCUSDT', 'BUY', 'MARKET', 100_000, 1);
    expect(() => order.validate()).not.toThrow();
  });

  it('should have symbol', async () => {
    const order = new Order('1', '1', 'BTCUSDT', 'BUY', 'MARKET', 100_000, 1);
    expect(() => order.validate()).not.toThrow();
  });

  it('should have clientOrderId', async () => {
    const order = new Order('1', '1', 'BTCUSDT', 'BUY', 'MARKET', 100_000, 1);
    expect(() => order.validate()).not.toThrow();
  });

  it('should throw error on empty symbol', async () => {
    const order = new Order('1', '1', '', 'BUY', 'MARKET', 100_000, 1);
    expect(() => order.validate()).toThrow(new Error('Symbol is empty'));
  });

  it('should throw error on empty clientOrderId', async () => {
    const order = new Order('1', '', '', 'BUY', 'MARKET', 100_000, 1);
    expect(() => order.validate()).toThrow(new Error('Client is empty'));
  });

  it('should throw error if quantity < 0.01', async () => {
    const order = new Order('1', '1', 'BTCUSDT', 'BUY', 'MARKET', 100_000, 0);
    expect(() => order.validate()).toThrow(new Error('Size must be >= 0.01'));
  });

  it('should throw error if price <= 0', async () => {
    const order = new Order('1', '1', 'BTCUSDT', 'BUY', 'MARKET', 0, 1);
    expect(() => order.validate()).toThrow(new Error('Price must be > 0'));
  });
});
