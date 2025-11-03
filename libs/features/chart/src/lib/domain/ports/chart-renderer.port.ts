import { Candle } from '@exchange-platform/market';
import { ChartOptions, IndicatorConfig } from '../models/chart-data.model';

/**
 * Port for chart rendering library
 */
export abstract class ChartRendererPort {
  /**
   * Initialize chart in the given container
   */
  abstract init(container: HTMLElement, options?: ChartOptions): void;

  /**
   * Add a candlestick series to the chart
   */
  abstract addCandlestickSeries(): void;

  /**
   * Set chart data (full dataset)
   */
  abstract setData(candles: Candle[]): void;

  /**
   * Update single candle (real-time update)
   * If candle with same timestamp exists, it will be updated
   * Otherwise, it will be appended
   */
  abstract updateCandle(candle: Candle): void;

  /**
   * Set volume data
   */
  abstract setVolumeData(candles: Candle[]): void;

  /**
   * Add indicator line to the chart
   */
  abstract addIndicator(config: IndicatorConfig): void;

  /**
   * Remove indicator from the chart
   */
  abstract removeIndicator(id: string): void;

  /**
   * Update chart theme
   */
  abstract setTheme(theme: 'light' | 'dark'): void;

  /**
   * Resize chart to new dimensions
   */
  abstract resize(width: number, height: number): void;

  /**
   * Fit chart content to visible area
   */
  abstract fitContent(): void;

  /**
   * Clear all chart data
   */
  abstract clear(): void;

  /**
   * Destroy chart and cleanup resources
   */
  abstract destroy(): void;
}
