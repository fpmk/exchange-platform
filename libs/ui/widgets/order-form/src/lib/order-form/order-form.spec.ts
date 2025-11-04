import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderForm } from './order-form';
import { signal } from '@angular/core';
import { AppStore, TradeStore } from '@exchange-platform/state';
import { FormBuilder } from '@angular/forms';
import { TradingPort } from '@exchange-platform/ports';
import {
  createMockAppStore,
  createMockTradeStore,
  createMockTradingPort,
} from '@exchange-platform/test-mocks';
import { OrderService } from '@exchange-platform/application-services';

describe('OrderForm', () => {
  let component: OrderForm;
  let fixture: ComponentFixture<OrderForm>;
  let orderService: OrderService;
  let mockAppStore: any;
  let tradeStore: any;
  let mockTradingPort: any;

  beforeEach(async () => {
    mockAppStore = createMockAppStore();
    tradeStore = {
      ...createMockTradeStore(),
      balance: signal(1000),
    };
    mockTradingPort = {
      ...createMockTradingPort(),
    };
    await TestBed.configureTestingModule({
      imports: [OrderForm],
      providers: [
        FormBuilder,
        OrderService,
        { provide: AppStore, useValue: mockAppStore },
        { provide: TradeStore, useValue: tradeStore },
        { provide: TradingPort, useValue: mockTradingPort },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderForm);
    orderService = TestBed.inject(OrderService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call placeOrder on facade when placeOrder is triggered', async () => {
    const spy = jest.spyOn(orderService, 'placeOrder');
    component['orderForm'].setValue({ price: 50000, size: 0.01 });

    component.placeOrder('BUY');

    expect(spy).toHaveBeenCalledWith({
      clientOrderId: '1',
      price: 50000,
      quantity: 0.01,
      symbol: 'BTCUSDT',
      type: 'MARKET',
      side: 'BUY',
    });
  });
});
