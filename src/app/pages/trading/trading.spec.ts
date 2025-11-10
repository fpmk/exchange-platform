import { ComponentFixture } from '@angular/core/testing';
import { createMockAppStore } from '@exchange-platform/test-mocks';
import { AppStore } from '@exchange-platform/state';
import { WebsocketService } from '@exchange-platform/application-services';
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
  let appStore: ReturnType<typeof createMockAppStore>;

  beforeEach(async () => {
    appStore = createMockAppStore();
    await MockBuilder(TradingPage)
      .mock(Orderbook)
      .mock(ChartWidgetComponent)
      .mock(OrderForm)
      .mock(WebsocketService)
      .provide({
        provide: AppStore,
        useValue: appStore,
      })
      .provide({
        provide: WebsocketService,
        useValue: mockWSService,
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
