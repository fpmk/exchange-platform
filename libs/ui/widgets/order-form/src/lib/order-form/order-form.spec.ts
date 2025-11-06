import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderForm } from './order-form';
import { AppStore, TradeStore } from '@exchange-platform/state';
import { FormBuilder } from '@angular/forms';
import { TradingPort } from '@exchange-platform/ports';
import {
  createMockAppStore,
  createMockTradingPort,
} from '@exchange-platform/test-mocks';
import { OrderService } from '@exchange-platform/application-services';

describe('OrderForm', () => {
  let component: OrderForm;
  let fixture: ComponentFixture<OrderForm>;
  let orderService: OrderService;
  let tradeStore: InstanceType<typeof TradeStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderForm],
      providers: [
        FormBuilder,
        OrderService,
        { provide: AppStore, useValue: createMockAppStore() },
        { provide: TradeStore },
        { provide: TradingPort, useValue: createMockTradingPort() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderForm);
    orderService = TestBed.inject(OrderService);
    tradeStore = TestBed.inject(TradeStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call placeOrder on facade when placeOrder is triggered', async () => {
    tradeStore.updateBalance(10_000);
    const spy = jest.spyOn(orderService, 'placeOrder');
    component['orderForm'].setValue({ price: 50_000, size: 0.01 });

    component.placeOrder('BUY');

    expect(spy).toHaveBeenCalledWith({
      clientOrderId: '1',
      price: 50_000,
      quantity: 0.01,
      symbol: 'BTCUSDT',
      type: 'MARKET',
      side: 'BUY',
    });
  });
});
