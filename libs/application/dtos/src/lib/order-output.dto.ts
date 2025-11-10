import { OrderSide, OrderStatus, OrderType, TimeInForce } from '@exchange-platform/types';

export interface OrderOutputDto {
  id: string;
  clientOrderId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  price: number;
  quantity: number;
  executedQty: number;
  cumulativeQuoteQty: number;
  status: OrderStatus;
  timeInForce: TimeInForce;
  time: number;
  updateTime: number;
}
