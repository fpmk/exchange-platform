import {
  CandlestickSeriesOptions,
  ChartOptions as LWCChartOptions,
  DeepPartial,
  HistogramSeriesOptions,
  LineSeriesOptions, Time
} from 'lightweight-charts';

/**
 * Chart Theme Presets for Lightweight Charts
 */
export const CHART_THEMES = {
  dark: {
    layout: {
      background: { color: '#1a1a1a' },
      textColor: '#d1d4dc',
    },
    grid: {
      vertLines: { color: '#2a2e39' },
      horzLines: { color: '#2a2e39' },
    },
    crosshair: {
      mode: 1, // CrosshairMode.Normal
    },
    timeScale: {
      borderColor: '#2a2e39',
      timeVisible: true,
      secondsVisible: false,
    },
    rightPriceScale: {
      borderColor: '#2a2e39',
    },
  },
  light: {
    layout: {
      background: { color: '#ffffff' },
      textColor: '#191919',
    },
    grid: {
      vertLines: { color: '#e1e3eb' },
      horzLines: { color: '#e1e3eb' },
    },
    crosshair: {
      mode: 1,
    },
    timeScale: {
      borderColor: '#e1e3eb',
      timeVisible: true,
      secondsVisible: false,
    },
    rightPriceScale: {
      borderColor: '#e1e3eb',
    },
  },
} as const;

/**
 * Default Candlestick Series Options
 */
export const DEFAULT_CANDLESTICK_OPTIONS: DeepPartial<CandlestickSeriesOptions> =
  {
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderVisible: false,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350',
  };

/**
 * Default Volume Series Options
 */
export const DEFAULT_VOLUME_OPTIONS: DeepPartial<HistogramSeriesOptions> = {
  color: '#26a69a',
  priceFormat: {
    type: 'volume',
  },
  priceScaleId: '',
};

/**
 * Default Indicator Line Options
 */
export const DEFAULT_LINE_OPTIONS: DeepPartial<LineSeriesOptions> = {
  color: '#2962FF',
  lineWidth: 2,
  crosshairMarkerVisible: true,
  crosshairMarkerRadius: 4,
};
