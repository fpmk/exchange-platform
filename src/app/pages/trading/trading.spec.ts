/* eslint-disable @angular-eslint/component-selector */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  createMockAppStore,
  createMockChartStore,
  createMockExchangeWebsocketPort,
  createMockExchangeWsStore,
  createMockMarketDataPort,
  createMockStoragePort,
  createMockTradingPort,
  createMockWsMarketDataPort
} from '@exchange-platform/test-mocks';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppStore, ChartStore, ExchangeWebSocketStore } from '@exchange-platform/state';
import { WebsocketService } from '@exchange-platform/application-services';
import { ExchangeWebsocketPort, MarketDataPort, StoragePort, TradingPort, WsMarketDataPort } from '@exchange-platform/ports';
import { TradingPage } from './trading';

jest.mock('@exchange-platform/orderbook', () => ({
  Orderbook: Component({ selector: 'lib-orderbook-widget', template: '<div>Mocked Chart</div>' })(class {}),
}));

jest.mock('@exchange-platform/order-form', () => ({
  OrderForm: Component({ selector: 'lib-order-form', template: '<div>Mocked Chart</div>' })(class {}),
}));

jest.mock('@exchange-platform/chart', () => ({
  ChartWidgetComponent: Component({ selector: 'lib-chart-widget', template: '<div>Mocked Chart</div>' })(
    class {}
  ),
}));

jest.mock('@angular/core/rxjs-interop', () => ({
  takeUntilDestroyed: jest.fn(() => (source: any) => source),
}));

const mockWSService = {
  connect: jest.fn(),
};

describe('TradingPage', () => {
  let component: TradingPage;
  let fixture: ComponentFixture<TradingPage>;
  let appStore: any;

  beforeEach(() => {
    appStore = createMockAppStore();
    TestBed.configureTestingModule({
      imports: [TradingPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: AppStore,
          useValue: appStore,
        },
        {
          provide: ExchangeWebSocketStore,
          useValue: createMockExchangeWsStore(),
        },
        {
          provide: WebsocketService,
          useValue: mockWSService,
        },
        {
          provide: ExchangeWebsocketPort,
          useValue: createMockExchangeWebsocketPort(),
        },
        {
          provide: ChartStore,
          useValue: createMockChartStore(),
        },
        {
          provide: MarketDataPort,
          useValue: createMockMarketDataPort(),
        },
        {
          provide: TradingPort,
          useValue: createMockTradingPort(),
        },
        {
          provide: WsMarketDataPort,
          useValue: createMockWsMarketDataPort(),
        },
        {
          provide: StoragePort,
          useValue: createMockStoragePort(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TradingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call wsService.connect and appState.markAsInitialized on init', () => {
    expect(mockWSService.connect).toHaveBeenCalledTimes(1);
    expect(appStore.markAsInitialized).toHaveBeenCalledTimes(1);
  });
});
