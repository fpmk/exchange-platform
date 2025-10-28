import {
  BinanceWsDepthLimitMessage,
  BinanceWsDepthMessage,
} from '../types/binance-ws.types';
import { BinanceRestDepth } from '../types/binance-rest.types';
import { OrderBook, OrderBookLevel } from '@exchange-platform/market';

export class OrderBookMapper {
  /**
   * Map REST Depth to OrderBook
   */
  static fromRestDepth(depth: BinanceRestDepth, symbol: string): OrderBook {
    return {
      symbol,
      bids: this.mapLevels(depth.bids),
      asks: this.mapLevels(depth.asks),
      lastUpdateId: depth.lastUpdateId,
      timestamp: Date.now(),
    };
  }

  /**
   * Map WebSocket Depth Update to OrderBook
   */
  static fromWsDepth(message: BinanceWsDepthMessage): OrderBook {
    return {
      symbol: message.s,
      bids: this.mapLevels(message.b),
      asks: this.mapLevels(message.a),
      lastUpdateId: message.u,
      timestamp: message.E,
    };
  }

  /**
   * Map WebSocket Depth Update to OrderBook
   */
  static fromWsLevelDepth(message: BinanceWsDepthLimitMessage): OrderBook {
    return {
      symbol: '',
      timestamp: 0,
      bids: this.mapLevels(message.bids),
      asks: this.mapLevels(message.asks),
      lastUpdateId: message.lastUpdateId,
    };
  }

  private static mapLevels(levels: [string, string][]): OrderBookLevel[] {
    let cumulativeTotal = 0;
    return levels
      .map(([price, quantity]) => {
        const qty = parseFloat(quantity);
        cumulativeTotal += qty;

        return {
          price: parseFloat(price),
          quantity: qty,
          total: cumulativeTotal,
        };
      })
      .filter((level) => level.quantity > 0); // Filter out zero quantities
  }
}
