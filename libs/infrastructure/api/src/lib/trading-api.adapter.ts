import {
  CancelOrderRequest,
  PlaceOrderRequest,
  TradingPort,
} from '@exchange-platform/ports';
import { Order } from '@exchange-platform/trading';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class TradingApiAdapter implements TradingPort {
  placeOrder(request: PlaceOrderRequest): Observable<Order> {
    // make HTTP/WS request to server
    return of();
  }

  cancelOrder(request: CancelOrderRequest): Observable<Order> {
    throw new Error('Method not implemented.');
  }

  getOrder(symbol: string, orderId: string): Observable<Order> {
    throw new Error('Method not implemented.');
  }

  getOpenOrders(symbol?: string): Observable<Order[]> {
    throw new Error('Method not implemented.');
  }

  getAllOrders(
    symbol: string,
    limit?: number,
    startTime?: number,
    endTime?: number
  ): Observable<Order[]> {
    throw new Error('Method not implemented.');
  }
}
