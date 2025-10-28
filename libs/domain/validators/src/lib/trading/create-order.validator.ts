import { Injectable } from '@angular/core';
import { OrderSide } from '@exchange-platform/trading';

export interface TradeOrderValidationInput {
  price: number;
  orderSize: number;
  direction: OrderSide;
  currentBalance: number;
}

@Injectable({ providedIn: 'root' })
export class CreateOrderValidator {
  validate(input: TradeOrderValidationInput): void {
    const orderCost = input.price * input.orderSize;
    if (orderCost > input.currentBalance) {
      throw new Error('Insufficient balance');
    }
    if (input.orderSize < 0.01) {
      throw new Error('Order size must be at least 0.01');
    }
    if (input.price <= 0) {
      throw new Error('Price must be greater than 0');
    }
  }
}
