import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TradingPort } from '@exchange-platform/ports';
import {
  Order,
  OrderSide,
  OrderType,
  TimeInForce,
} from '@exchange-platform/trading';
import { CreateOrderValidator } from '@exchange-platform/domain-validators';

export interface PlaceOrderCommand {
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price: number;
  stopPrice?: number;
  timeInForce?: TimeInForce;
  clientOrderId?: string;
}

@Injectable({ providedIn: 'root' })
export class PlaceOrderUseCase {
  private tradingPort = inject(TradingPort);
  private orderValidator = inject(CreateOrderValidator);

  execute(command: PlaceOrderCommand, balance: number): Observable<Order> {
    this.orderValidator.validate({
      direction: command.side,
      orderSize: command.quantity,
      price: command.price,
      currentBalance: balance,
    });
    return this.tradingPort.placeOrder(command);
  }
}
