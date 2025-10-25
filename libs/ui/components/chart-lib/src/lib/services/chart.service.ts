import { DestroyRef, inject, Injectable } from '@angular/core';
import {
  CandlestickData as LWCCandlestickData,
  CandlestickSeries,
  ChartOptions as LWCChartOptions,
  createChart,
  DeepPartial,
  HistogramData,
  HistogramSeries,
  IChartApi,
  ISeriesApi,
  LineData as LWCLineData,
  LineSeries,
} from 'lightweight-charts';
import {
  CandlestickData,
  CHART_THEMES,
  ChartOptions,
  DEFAULT_CANDLESTICK_OPTIONS,
  DEFAULT_LINE_OPTIONS,
  DEFAULT_VOLUME_OPTIONS,
  LineData,
  VolumeData,
} from '../types/chart-options.types';

/**
 * Lightweight Charts Service
 * Manages chart instance and series
 */
@Injectable()
export class ChartService {
  private destroyRef = inject(DestroyRef);

  private chart: IChartApi | null = null;
  private candlestickSeries: ISeriesApi<'Candlestick'> | null = null;
  private volumeSeries: ISeriesApi<'Histogram'> | null = null;
  private indicatorSeries = new Map<string, ISeriesApi<'Line'>>();

  private resizeObserver: ResizeObserver | null = null;

  /**
   * Initialize chart
   */
  initialize(container: HTMLElement, options: ChartOptions = {}): void {
    if (this.chart) {
      console.warn('Chart already initialized');
      return;
    }

    const theme = options.theme || 'dark';
    const themeOptions = CHART_THEMES[theme];

    const chartOptions: DeepPartial<LWCChartOptions> = {
      ...themeOptions,
      ...options,
      width: container.clientWidth,
      height: container.clientHeight,
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

    this.chart = createChart(container, chartOptions);

    // Create candlestick series
    this.candlestickSeries = this.chart.addSeries(
      CandlestickSeries,
      DEFAULT_CANDLESTICK_OPTIONS
    );

    // Setup auto-resize
    this.setupResizeObserver(container);

    this.setupResizeObserver(container);

    // Cleanup on destroy
    this.destroyRef.onDestroy(() => this.destroy());

    console.log('Chart initialized');
  }

  /**
   * Add volume series
   */
  addVolumeSeries(): void {
    if (!this.chart) return;
    if (this.volumeSeries) return;

    this.volumeSeries = this.chart.addSeries(
      HistogramSeries,
      DEFAULT_VOLUME_OPTIONS
    );
    console.log('📊 Volume series added');
  }

  /**
   * Add indicator line
   */
  addIndicator(id: string, color = '#2962FF'): void {
    if (!this.chart) return;
    if (this.indicatorSeries.has(id)) return;

    const series = this.chart.addSeries(LineSeries, {
      ...DEFAULT_LINE_OPTIONS,
      color,
    });

    this.indicatorSeries.set(id, series);
    console.log(`📊 Indicator added: ${id}`);
  }

  /**
   * Remove indicator
   */
  removeIndicator(id: string): void {
    const series = this.indicatorSeries.get(id);
    if (!series || !this.chart) return;

    this.chart.removeSeries(series);
    this.indicatorSeries.delete(id);
    console.log(`📊 Indicator removed: ${id}`);
  }

  /**
   * Update candlestick data
   */
  setCandlestickData(data: CandlestickData[]): void {
    if (!this.candlestickSeries) return;
    this.candlestickSeries.setData(data as LWCCandlestickData[]);
  }

  /**
   * Update single candle (for real-time)
   */
  updateCandle(candle: CandlestickData): void {
    if (!this.candlestickSeries) return;
    this.candlestickSeries.update(candle as LWCCandlestickData);
  }

  /**
   * Update volume data
   */
  setVolumeData(data: VolumeData[]): void {
    if (!this.volumeSeries) return;
    this.volumeSeries.setData(data as HistogramData[]);
  }

  /**
   * Update indicator data
   */
  setIndicatorData(id: string, data: LineData[]): void {
    const series = this.indicatorSeries.get(id);
    if (!series) return;
    series.setData(data as LWCLineData[]);
  }

  /**
   * Fit content to view
   */
  fitContent(): void {
    if (!this.chart) return;
    this.chart.timeScale().fitContent();
  }

  /**
   * Apply theme
   */
  applyTheme(theme: 'light' | 'dark'): void {
    if (!this.chart) return;

    const themeOptions = CHART_THEMES[theme];
    this.chart.applyOptions(themeOptions);
    console.log(`Theme applied: ${theme}`);
  }

  /**
   * Resize chart
   */
  resize(width: number, height: number): void {
    if (!this.chart) return;
    this.chart.resize(width, height);
  }

  /**
   * Get chart instance (for advanced use)
   */
  getChart(): IChartApi | null {
    return this.chart;
  }

  /**
   * Destroy chart
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
  }

  /**
   * Setup resize observer
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
}
