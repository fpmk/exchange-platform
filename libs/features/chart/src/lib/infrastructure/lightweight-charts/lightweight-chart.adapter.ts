import { DestroyRef, inject, Injectable } from '@angular/core';
import {
  CandlestickSeries,
  createChart,
  DeepPartial,
  HistogramSeries,
  LineSeries,
  IChartApi,
  ISeriesApi,
  ChartOptions as LWCChartOptions,
} from 'lightweight-charts';
import { ChartRendererPort } from '../../domain/ports/chart-renderer.port';
import { ChartOptions, IndicatorConfig } from '../../domain/models/chart-data.model';
import { Candle } from '@exchange-platform/market';
import { LightweightCandleMapper } from './mappers/lw-candle.mapper';
import {
  CHART_THEMES,
  DEFAULT_CANDLESTICK_OPTIONS,
  DEFAULT_VOLUME_OPTIONS,
  DEFAULT_LINE_OPTIONS,
} from './types/lw-chart.types';

/**
 * Lightweight Charts implementation of ChartRendererPort
 *
 * This adapter wraps the Lightweight Charts library and provides
 * a clean interface that can be swapped with other chart implementations
 * (e.g., TradingView, custom canvas renderer, etc.)
 */
@Injectable()
export class LightweightChartAdapter implements ChartRendererPort {
  private destroyRef = inject(DestroyRef);

  private chart: IChartApi | null = null;
  private candlestickSeries: ISeriesApi<'Candlestick'> | null = null;
  private volumeSeries: ISeriesApi<'Histogram'> | null = null;
  private indicatorSeries = new Map<string, ISeriesApi<'Line'>>();
  private resizeObserver: ResizeObserver | null = null;

  private currentContainer: HTMLElement | null = null;
  private currentTheme: 'light' | 'dark' = 'dark';

  constructor() {
    // Auto-cleanup on destroy
    this.destroyRef.onDestroy(() => this.destroy());
  }

  /**
   * Initialize chart in the given container
   */
  init(container: HTMLElement, options: ChartOptions = {}): void {
    if (this.chart) {
      console.warn('Chart already initialized. Call destroy() first.');
      return;
    }

    this.currentContainer = container;
    this.currentTheme = options.theme || 'dark';

    const themeOptions = CHART_THEMES[this.currentTheme];

    const chartOptions: DeepPartial<LWCChartOptions> = {
      ...themeOptions,
      width: options.width || container.clientWidth,
      height: options.height || container.clientHeight,
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    };

    // Create chart instance
    this.chart = createChart(container, chartOptions);

    // Setup auto-resize
    this.setupResizeObserver(container);

    console.log('Lightweight Charts initialized');
  }

  /**
   * Add candlestick series (required before setting data)
   */
  addCandlestickSeries(): void {
    if (!this.chart) {
      console.error('Chart not initialized. Call init() first.');
      return;
    }

    if (this.candlestickSeries) {
      console.warn('Candlestick series already added');
      return;
    }

    this.candlestickSeries = this.chart.addSeries(
      CandlestickSeries,
      DEFAULT_CANDLESTICK_OPTIONS
    );

    console.log('Candlestick series added');
  }

  /**
   * Set full dataset of candles
   */
  setData(candles: Candle[]): void {
    if (!this.candlestickSeries) {
      console.warn('Candlestick series not added. Call addCandlestickSeries() first.');
      this.addCandlestickSeries();
    }

    if (!this.candlestickSeries) return;

    const chartData = LightweightCandleMapper.toChartDataArray(candles);
    this.candlestickSeries.setData(chartData);

    console.log(`Chart data set: ${candles.length} candles`);
  }

  /**
   * Update single candle (for real-time updates)
   */
  updateCandle(candle: Candle): void {
    if (!this.candlestickSeries) {
      console.warn('Candlestick series not added');
      return;
    }

    const chartData = LightweightCandleMapper.toChartData(candle);
    this.candlestickSeries.update(chartData);
  }

  /**
   * Set volume data
   */
  setVolumeData(candles: Candle[]): void {
    if (!this.volumeSeries) {
      this.addVolumeSeries();
    }

    if (!this.volumeSeries) return;

    const volumeData = LightweightCandleMapper.toVolumeDataArray(candles);
    this.volumeSeries.setData(volumeData);

    console.log(`Volume data set: ${candles.length} bars`);
  }

  /**
   * Add indicator line to the chart
   */
  addIndicator(config: IndicatorConfig): void {
    if (!this.chart) {
      console.warn('Chart not initialized');
      return;
    }

    if (this.indicatorSeries.has(config.id)) {
      console.warn(`Indicator ${config.id} already exists`);
      return;
    }

    const series = this.chart.addSeries(LineSeries, {
      ...DEFAULT_LINE_OPTIONS,
      color: config.color || DEFAULT_LINE_OPTIONS.color,
    });

    this.indicatorSeries.set(config.id, series);
    console.log(`Indicator added: ${config.id}`);
  }

  /**
   * Remove indicator from the chart
   */
  removeIndicator(id: string): void {
    const series = this.indicatorSeries.get(id);
    if (!series || !this.chart) {
      console.warn(`Indicator ${id} not found`);
      return;
    }

    this.chart.removeSeries(series);
    this.indicatorSeries.delete(id);
    console.log(`Indicator removed: ${id}`);
  }

  /**
   * Update chart theme
   */
  setTheme(theme: 'light' | 'dark'): void {
    if (!this.chart) return;

    this.currentTheme = theme;
    const themeOptions = CHART_THEMES[theme];
    this.chart.applyOptions(themeOptions);

    console.log(`Theme changed to: ${theme}`);
  }

  /**
   * Resize chart to new dimensions
   */
  resize(width: number, height: number): void {
    if (!this.chart) return;
    this.chart.resize(width, height);
  }

  /**
   * Fit chart content to visible area
   */
  fitContent(): void {
    if (!this.chart) return;
    this.chart.timeScale().fitContent();
  }

  /**
   * Clear all chart data
   */
  clear(): void {
    if (this.candlestickSeries) {
      this.candlestickSeries.setData([]);
    }
    if (this.volumeSeries) {
      this.volumeSeries.setData([]);
    }
    console.log('Chart data cleared');
  }

  /**
   * Destroy chart and cleanup resources
   */
  destroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.chart) {
      this.chart.remove();
      this.chart = null;
    }

    this.candlestickSeries = null;
    this.volumeSeries = null;
    this.indicatorSeries.clear();
    this.currentContainer = null;

    console.log('Chart destroyed');
  }

  /**
   * Add volume series (histogram)
   */
  private addVolumeSeries(): void {
    if (!this.chart) return;
    if (this.volumeSeries) return;

    this.volumeSeries = this.chart.addSeries(
      HistogramSeries,
      DEFAULT_VOLUME_OPTIONS
    );

    console.log('Volume series added');
  }

  /**
   * Setup resize observer for auto-resizing
   */
  private setupResizeObserver(container: HTMLElement): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const { width, height } = entry.contentRect;
      this.resize(width, height);
    });

    this.resizeObserver.observe(container);
  }

  /**
   * Get raw chart instance (for advanced use cases)
   * @internal Use with caution - breaks abstraction
   */
  getChartInstance(): IChartApi | null {
    return this.chart;
  }
}
