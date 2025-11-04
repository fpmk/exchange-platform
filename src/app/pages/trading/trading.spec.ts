import { ComponentFixture } from '@angular/core/testing';
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
import { AppStore, ChartStore, ExchangeWebSocketStore } from '@exchange-platform/state';
import { WebsocketService } from '@exchange-platform/application-services';
import { ExchangeWebsocketPort, MarketDataPort, StoragePort, TradingPort, WsMarketDataPort } from '@exchange-platform/ports';
import { TradingPage } from './trading';
import { MockBuilder, MockRender } from 'ng-mocks';
import { Orderbook } from '@exchange-platform/orderbook';
import { ChartWidgetComponent } from '@exchange-platform/chart';
import { OrderForm } from '@exchange-platform/order-form';

const mockWSService = {
  connect: jest.fn(),
};

describe('TradingPage', () => {
  let component: TradingPage;
  let fixture: ComponentFixture<TradingPage>;
  let appStore: any;

  beforeEach(async () => {
    appStore = createMockAppStore();
    await MockBuilder(TradingPage)
      .mock(Orderbook)
      .mock(ChartWidgetComponent)
      .mock(OrderForm)
      .provide({
        provide: AppStore,
        useValue: appStore,
      })
      .provide({
        provide: ExchangeWebSocketStore,
        useValue: createMockExchangeWsStore(),
      })
      .provide({
        provide: WebsocketService,
        useValue: mockWSService,
      })
      .provide({
        provide: ExchangeWebsocketPort,
        useValue: createMockExchangeWebsocketPort(),
      })
      .provide({
        provide: ChartStore,
        useValue: createMockChartStore(),
      })
      .provide({
        provide: TradingPort,
        useValue: createMockTradingPort(),
      })
      .provide({
        provide: MarketDataPort,
        useValue: createMockMarketDataPort(),
      })
      .provide({
        provide: WsMarketDataPort,
        useValue: createMockWsMarketDataPort(),
      })
      .provide({
        provide: StoragePort,
        useValue: createMockStoragePort(),
      });
    fixture = MockRender(TradingPage);
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
