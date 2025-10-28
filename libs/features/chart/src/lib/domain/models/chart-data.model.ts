/**
 * Domain models for chart data
 *
 * These are pure domain types - not tied to any specific chart library
 */

/**
 * Chart initialization options
 */
export interface ChartOptions {
  theme?: 'light' | 'dark';
  height?: number;
  width?: number;
  autoSize?: boolean;
}

/**
 * Chart series configuration
 */
export interface ChartSeriesConfig {
  type: 'candlestick' | 'line' | 'area' | 'histogram';
  color?: string;
}

/**
 * Indicator configuration
 */
export interface IndicatorConfig {
  id: string;
  color?: string;
}