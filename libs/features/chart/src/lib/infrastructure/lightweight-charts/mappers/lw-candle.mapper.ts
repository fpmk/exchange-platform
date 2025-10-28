import { Candle } from '@exchange-platform/market';
import {
  CandlestickData as LWCCandlestickData,
  Time,
} from 'lightweight-charts';

/**
 * Mapper for converting domain Candle to Lightweight Charts format
 */
export class LightweightCandleMapper {
  /**
   * Convert domain Candle to Lightweight Charts CandlestickData
   */
  static toChartData(candle: Candle): LWCCandlestickData {
    return {
      time: candle.time as Time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    };
  }

  /**
   * Convert array of domain Candles to Lightweight Charts format
   */
  static toChartDataArray(candles: Candle[]): LWCCandlestickData[] {
    return candles.map((candle) => this.toChartData(candle));
  }

  /**
   * Convert domain Candle to volume histogram data
   */
  static toVolumeData(candle: Candle): {
    time: Time;
    value: number;
    color?: string;
  } {
    // Green volume for bullish candles, red for bearish
    const color = candle.close >= candle.open ? '#26a69a' : '#ef5350';

    return {
      time: candle.time as Time,
      value: candle.volume,
      color,
    };
  }

  /**
   * Convert array of domain Candles to volume data
   */
  static toVolumeDataArray(
    candles: Candle[]
  ): Array<{ time: Time; value: number; color?: string }> {
    return candles.map((candle) => this.toVolumeData(candle));
  }
}