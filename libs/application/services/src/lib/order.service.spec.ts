import { TestBed } from '@angular/core/testing';

import { OrderService } from './order.service';
import { ExchangeWebsocketPort, TradingPort } from '@exchange-platform/ports';
import { createMockExchangeWebsocketPort, createMockTradingPort } from '@exchange-platform/test-mocks';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TradingPort,
          useValue: createMockTradingPort(),
        },
        {
          provide: ExchangeWebsocketPort,
          useValue: createMockExchangeWebsocketPort(),
        },
      ],
    });
    service = TestBed.inject(OrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
