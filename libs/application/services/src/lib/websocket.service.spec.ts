import { TestBed } from '@angular/core/testing';

import { WebsocketService } from './websocket.service';
import { ExchangeWebsocketPort } from '@exchange-platform/ports';
import { createMockExchangeWebsocketPort } from '@exchange-platform/test-mocks';

describe('Websocket', () => {
  let service: WebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ExchangeWebsocketPort,
          useValue: createMockExchangeWebsocketPort(),
        },
      ],
    });
    service = TestBed.inject(WebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
