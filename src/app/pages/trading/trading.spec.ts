import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TradingPage } from './trading';
import { WebSocketPort, MarketDataPort } from '@exchange-platform/ports';

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
    getCandles: jest.fn(),
    getOrderBook: jest.fn(),
    getSymbols: jest.fn(),
    getSymbol: jest.fn(),
    subscribeToCandleUpdates: jest.fn(),
    subscribeToOrderBookUpdates: jest.fn(),
    subscribeToTickerUpdates: jest.fn(),
    subscribeToAllTickersUpdates: jest.fn()
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
