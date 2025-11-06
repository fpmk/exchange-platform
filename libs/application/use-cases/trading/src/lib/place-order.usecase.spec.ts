import { TradingPort } from '@exchange-platform/ports';
import { createMockTradingPort } from '@exchange-platform/test-mocks';
import { TestBed } from '@angular/core/testing';
import { TradeStore } from '@exchange-platform/state';
import { PlaceOrderQuery, PlaceOrderUseCase } from './place-order.usecase';
import { firstValueFrom } from 'rxjs';

describe('Place new order use case', () => {
  let tradingPort: jest.Mocked<ReturnType<typeof createMockTradingPort>>;
  let tradeStore: InstanceType<typeof TradeStore>;
  let placeOrderUseCase: PlaceOrderUseCase;

  beforeEach(() => {
    tradingPort = createMockTradingPort();
    TestBed.configureTestingModule({
      providers: [
        TradeStore,
        {
          provide: TradingPort,
          useValue: tradingPort,
        },
      ],
    });
    placeOrderUseCase = TestBed.inject(PlaceOrderUseCase);
    tradeStore = TestBed.inject(TradeStore);
  });

  it('should throw insufficient balance exception', async () => {
    const query: PlaceOrderQuery = {
      clientOrderId: '1',
      symbol: 'BTCUSDT',
      side: 'BUY',
      type: 'MARKET',
      quantity: 1,
      price: 100_000,
    };
    tradeStore.updateBalance(0);
    expect(() => placeOrderUseCase.execute(query)).toThrow(
      new Error('Insufficient balance')
    );
  });

  it('should throw symbol is empty exception', async () => {
    const query: PlaceOrderQuery = {
      clientOrderId: '1',
      symbol: '',
      side: 'BUY',
      type: 'MARKET',
      quantity: 1,
      price: 100_000,
    };
    expect(() => placeOrderUseCase.execute(query)).toThrow(
      new Error('Symbol is empty')
    );
  });
  it('should place order successfully', async () => {
    const query: PlaceOrderQuery = {
      clientOrderId: '1',
      symbol: 'BTCUSDT',
      side: 'BUY',
      type: 'MARKET',
      quantity: 1,
      price: 100_000,
    };
    tradeStore.updateBalance(200_000);
    await expect(
      firstValueFrom(placeOrderUseCase.execute(query))
    ).resolves.toStrictEqual({ id: 'test-order' });
  });
});
