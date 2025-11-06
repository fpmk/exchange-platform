import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TradingPort } from '@exchange-platform/ports';
import { Order } from '@exchange-platform/trading';
import { TradeStore } from '@exchange-platform/state';
import { OrderSide, OrderType, TimeInForce } from '@exchange-platform/types';

export interface PlaceOrderQuery {
  clientOrderId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price: number;
  stopPrice?: number;
  timeInForce?: TimeInForce;
}

@Injectable({ providedIn: 'root' })
export class PlaceOrderUseCase {
  private tradingPort = inject(TradingPort);
  private tradeStore = inject(TradeStore);

  execute(query: PlaceOrderQuery): Observable<Order> {
    const order = new Order(
      '',
      query.clientOrderId,
      query.symbol,
      query.side,
      query.type,
      query.price,
      query.quantity
    );
    order.validate();
    if (order.quantity * order.price > this.tradeStore.balance()) {
      throw new Error('Insufficient balance');
    }
    return this.tradingPort.placeOrder(order);
  }
}
