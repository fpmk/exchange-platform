import { OrderSide, OrderStatus, OrderType, TimeInForce } from '@exchange-platform/types';

export class Order {
  constructor(
    public id: string,
    public clientOrderId: string,
    public symbol: string,
    public side: OrderSide,
    public type: OrderType,
    public price: number,
    public quantity: number,
    public executedQty?: number,
    public cumulativeQuoteQty?: number,
    public status?: OrderStatus,
    public timeInForce?: TimeInForce,
    public time?: number,
    public updateTime?: number
  ) {}

  validate(): void {
    if (!this.clientOrderId)  throw new Error('Client is empty');
    if (!this.symbol)  throw new Error('Symbol is empty');
    if (this.price <= 0) throw new Error('Price must be > 0');
    if (this.quantity < 0.01) throw new Error('Size must be >= 0.01');
  }
}
