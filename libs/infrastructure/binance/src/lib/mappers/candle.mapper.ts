import { Candle } from '@exchange-platform/market';
import { BinanceKline } from '../types/binance-ws.types';
import { BinanceRestKline } from '../types/binance-rest.types';

/**
 * Infrastructure Layer Mapper
 *
 * Responsibility: Transform external API data (Binance) to Domain models
 * Location: Infrastructure Layer (binance adapter)
 *
 * Clean Architecture Rule:
 * - Infrastructure depends on Domain ✅
 * - Infrastructure does NOT depend on Presentation ✅
 * - No UI concerns (colors, formatting for specific libraries) ✅
 */
export class CandleMapper {
  /**
   * Map WebSocket Kline to Domain Candle
   */
  static fromWsKline(kline: BinanceKline): Candle {
    return {
      time: Math.floor(kline.t / 1000), // Convert ms to seconds (Unix timestamp)
      open: parseFloat(kline.o),
      high: parseFloat(kline.h),
      low: parseFloat(kline.l),
      close: parseFloat(kline.c),
      volume: parseFloat(kline.v),
    };
  }

  /**
   * Map REST API Kline array to Domain Candle
   */
  static fromRestKline(kline: BinanceRestKline): Candle {
    return {
      time: Math.floor(kline[0] / 1000), // Convert ms to seconds
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5]),
    };
  }

  /**
   * Map array of REST Klines to Domain Candles
   */
  static fromRestKlineArray(klines: BinanceRestKline[]): Candle[] {
    return klines.map((k) => this.fromRestKline(k));
  }
}
