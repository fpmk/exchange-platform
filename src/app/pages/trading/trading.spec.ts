import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TradingPage } from './trading';
import { WebSocketPort, MarketDataPort, StoragePort, TradingPort } from '@exchange-platform/ports';
import { ChartFacade } from '@exchange-platform/chart';

describe('TradingPage', () => {
  let component: TradingPage;
  let fixture: ComponentFixture<TradingPage>;

  // Mock WebSocketPort implementation
  const mockWebSocketPort = {
    connect: jest.fn().mockReturnValue(of({
      status: 'connected' as const,
      timestamp: Date.now()
    })),
    disconnect: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
    getConnectionStatus: jest.fn().mockReturnValue(of('connected' as const))
  };

  // Mock MarketDataPort implementation
  const mockMarketDataPort = {
    getCandles: jest.fn().mockReturnValue(of([])),
    getOrderBook: jest.fn().mockReturnValue(of({ bids: [], asks: [], lastUpdateId: 0, timestamp: 0 })),
    getSymbols: jest.fn().mockReturnValue(of([])),
    getSymbol: jest.fn().mockReturnValue(of({ symbol: 'BTCUSDT', price: 50000 })),
    subscribeToCandleUpdates: jest.fn().mockReturnValue(of({ open: 50000, high: 50100, low: 49900, close: 50050, volume: 100, timestamp: Date.now() })),
    subscribeToOrderBookUpdates: jest.fn().mockReturnValue(of({ bids: [], asks: [], lastUpdateId: 0, timestamp: 0 })),
    subscribeToTickerUpdates: jest.fn().mockReturnValue(of({ symbol: 'BTCUSDT', price: 50000 })),
    subscribeToAllTickersUpdates: jest.fn().mockReturnValue(of([]))
  };

  // Mock StoragePort implementation
  const mockStoragePort = {
    get: jest.fn().mockReturnValue(of(null)), // Return Observable of null
    set: jest.fn().mockReturnValue(of(undefined)), // Return Observable
    remove: jest.fn()
  };

  // Mock TradingPort implementation
  const mockTradingPort = {
    placeOrder: jest.fn().mockReturnValue(of({ id: '123', status: 'NEW' })),
    cancelOrder: jest.fn().mockReturnValue(of({ orderId: '123', status: 'CANCELED' })),
  };

  // Mock ChartFacade implementation (minimal)
  const mockChartFacade = {
    // Add properties as needed based on ChartFacade interface
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingPage],
      providers: [
        {
          provide: WebSocketPort,
          useValue: mockWebSocketPort
        },
        {
          provide: MarketDataPort,
          useValue: mockMarketDataPort
        },
        {
          provide: StoragePort,
          useValue: mockStoragePort
        },
        {
          provide: TradingPort,
          useValue: mockTradingPort
        },
        {
          provide: ChartFacade,
          useValue: mockChartFacade
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TradingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
