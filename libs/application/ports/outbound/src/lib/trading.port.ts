import { Observable } from 'rxjs';
import { Order } from '@exchange-platform/trading';

export interface CancelOrderRequest {
  symbol: string;
  orderId?: string;
  clientOrderId?: string;
}

export abstract class TradingPort {
  abstract placeOrder(request: Order): Observable<Order>;

  abstract cancelOrder(request: CancelOrderRequest): Observable<Order>; // ???

  abstract getOrder(symbol: string, orderId: string): Observable<Order>;

  abstract getOpenOrders(symbol?: string): Observable<Order[]>;

  abstract getAllOrders(
    symbol: string,
    limit?: number,
    startTime?: number,
    endTime?: number
  ): Observable<Order[]>;
}
