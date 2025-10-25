import { Candle } from '@exchange-platform/market';
import { CandlestickData, VolumeData } from '@exchange-platform/chart-lib';

/**
 * Presentation Layer Mapper
 *
 * Responsibility: Transform Domain models to UI-specific data structures
 * Location: Presentation Layer (widgets/chart)
 *
 * Clean Architecture Rule:
 * - Presentation depends on Domain ✅
 * - Presentation depends on UI Library (lightweight-charts) ✅
 * - Contains UI-specific logic (colors, formatting) ✅
 */
export class ChartDataMapper {
  /**
   * Map Domain Candle to CandlestickData for chart display
   */
  static toCandlestickData(candle: Candle): CandlestickData {
    return {
      time: candle.time as any, // lightweight-charts Time type
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    };
  }

  /**
   * Map Domain Candle to VolumeData for chart display
   * Includes UI logic: color based on bullish/bearish candle
   */
  static toVolumeData(candle: Candle): VolumeData {
    const isBullish = candle.close >= candle.open;

    return {
      time: candle.time as any,
      value: candle.volume,
      color: isBullish ? '#26a69a80' : '#ef535080', // Semi-transparent green/red
    };
  }

  /**
   * Batch conversion for candlestick data
   */
  static toCandlestickDataArray(candles: Candle[]): CandlestickData[] {
    return candles.map((candle) => this.toCandlestickData(candle));
  }

  /**
   * Batch conversion for volume data
   */
  static toVolumeDataArray(candles: Candle[]): VolumeData[] {
    return candles.map((candle) => this.toVolumeData(candle));
  }
}
