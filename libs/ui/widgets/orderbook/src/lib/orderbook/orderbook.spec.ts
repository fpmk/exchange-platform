import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Orderbook } from './orderbook';
import { AppStore, ChartStore, TradeStore } from '@exchange-platform/state';
import { OrderBookFacade } from '../facades/order-book.facade';
import { MarketDataPort, StoragePort } from '@exchange-platform/ports';
import {
  createMockAppStore,
  createMockChartStore,
  createMockMarketDataPort,
  createMockStoragePort,
  createMockTradeStore,
} from '@exchange-platform/test-mocks';

describe('Orderbook', () => {
  let component: Orderbook;
  let fixture: ComponentFixture<Orderbook>;
  let mockAppStore: any;
  let mockChartStore: any;
  let mockTradeStore: any;
  let mockOrderBookFacade: any;
  let mockStorage: any;
  let mockMarketDataPort: any;

  beforeEach(async () => {
    mockAppStore = {
      ...createMockAppStore(),
    };

    mockChartStore = {
      ...createMockChartStore(),
    };

    mockTradeStore = {
      ...createMockTradeStore(),
    };

    mockOrderBookFacade = {
      loadOrderbook: jest.fn(),
    };

    mockStorage = { ...createMockStoragePort() };

    mockMarketDataPort = { ...createMockMarketDataPort() };

    await TestBed.configureTestingModule({
      imports: [Orderbook],
      providers: [
        { provide: AppStore, useValue: mockAppStore },
        { provide: ChartStore, useValue: mockChartStore },
        { provide: TradeStore, useValue: mockTradeStore },
        { provide: OrderBookFacade, useValue: mockOrderBookFacade },
        { provide: StoragePort, useValue: mockStorage },
        { provide: MarketDataPort, useValue: mockMarketDataPort },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Orderbook);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
