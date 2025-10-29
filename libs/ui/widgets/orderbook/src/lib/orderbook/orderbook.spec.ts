import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Orderbook } from './orderbook';
import { AppStore, ChartStore, TradeStore } from '@exchange-platform/state';
import { OrderBookFacade } from '../facades/order-book.facade';
import { StoragePort, MarketDataPort } from '@exchange-platform/ports';
import { of } from 'rxjs';
import { createMockAppStore, createMockChartStore, createMockTradeStore } from '@exchange-platform/test-mocks';

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
      ...createMockAppStore()
    };

    mockChartStore = {
      ...createMockChartStore()
    };

    mockTradeStore = {
      ...createMockTradeStore()
    };

    mockOrderBookFacade = {
      loadOrderbook: jest.fn(),
    };

    mockStorage = {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
      has: jest.fn(),
    };

    mockMarketDataPort = {
      getCandles: jest.fn().mockReturnValue(of([])),
      getOrderBook: jest.fn().mockReturnValue(of({ bids: [], asks: [] })),
      getSymbols: jest.fn().mockReturnValue(of([])),
      getSymbol: jest.fn().mockReturnValue(of({})),
      subscribeToCandleUpdates: jest.fn().mockReturnValue(of({})),
      subscribeToOrderBookUpdates: jest.fn().mockReturnValue(of({ bids: [], asks: [] })),
      subscribeToTickerUpdates: jest.fn().mockReturnValue(of({})),
      subscribeToAllTickersUpdates: jest.fn().mockReturnValue(of([])),
    };

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
