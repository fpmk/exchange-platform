import { inject, Injectable } from '@angular/core';
import { Candle } from '@exchange-platform/market';
import { ChartRendererPort } from '../../domain/ports/chart-renderer.port';
import { ChartOptions } from '../../domain/models/chart-data.model';

/**
 * Chart Facade (Feature Orchestrator)
 *
 * Responsibilities:
 * - Coordinates chart rendering through the ChartRendererPort abstraction
 * - Manages chart lifecycle (initialize, update, destroy)
 * - Provides high-level API for chart operations
 * - Decoupled from any specific chart library implementation
 */
@Injectable()
export class ChartFacade {
  private readonly chartRenderer = inject(ChartRendererPort);

  /**
   * Initialize chart in a container
   */
  initialize(container: HTMLElement, options?: ChartOptions): void {
    this.chartRenderer.init(container, options);
    this.chartRenderer.addCandlestickSeries();
  }

  /**
   * Set chart data (full dataset)
   */
  setData(candles: Candle[]): void {
    this.chartRenderer.setData(candles);
  }

  /**
   * Update single candle (for real-time updates)
   */
  updateCandle(candle: Candle): void {
    this.chartRenderer.updateCandle(candle);
  }

  /**
   * Set volume data
   */
  setVolumeData(candles: Candle[]): void {
    this.chartRenderer.setVolumeData(candles);
  }

  /**
   * Add indicator line
   */
  addIndicator(id: string, color?: string): void {
    this.chartRenderer.addIndicator({ id, color });
  }

  /**
   * Remove indicator
   */
  removeIndicator(id: string): void {
    this.chartRenderer.removeIndicator(id);
  }

  /**
   * Apply theme
   */
  applyTheme(theme: 'light' | 'dark'): void {
    this.chartRenderer.setTheme(theme);
  }

  /**
   * Fit content to view
   */
  fitContent(): void {
    this.chartRenderer.fitContent();
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.chartRenderer.clear();
  }

  /**
   * Destroy chart and cleanup
   */
  destroy(): void {
    this.chartRenderer.destroy();
  }
}
