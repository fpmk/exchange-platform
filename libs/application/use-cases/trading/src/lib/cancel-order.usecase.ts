import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CancelOrderRequest, TradingPort } from '@exchange-platform/ports';
import { Order } from '@exchange-platform/trading';

@Injectable({ providedIn: 'root' })
export class CancelOrderUseCase {
  private tradingPort = inject(TradingPort);

  execute(command: CancelOrderRequest): Observable<Order> {
    return this.tradingPort.cancelOrder(command);
  }
}
