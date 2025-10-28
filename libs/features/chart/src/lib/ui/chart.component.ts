import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Candle } from '@exchange-platform/market';
import { ChartFacade } from '../application/facades/chart.facade';
import { ChartOptions } from '../domain/models/chart-data.model';
import { CHART_FEATURE_PROVIDERS } from '../chart-feature.config';

@Component({
  selector: 'lib-chart',
  standalone: true,
  providers: [ChartFacade, ...CHART_FEATURE_PROVIDERS],
  template: `
    @if (loading) {
    <div
      class="absolute z-2 w-full h-full opacity-50 left-0 top-0 flex items-center justify-center"
    >
      Loading...
    </div>
    }
    <div class="chart-wrapper" #chartContainer></div>
  `,
  styles: [
    `
      :host {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
      }

      .chart-wrapper {
        width: 100%;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnChanges, AfterViewInit {
  private readonly chartFacade = inject(ChartFacade);
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('chartContainer', { static: true })
  chartContainer!: ElementRef<HTMLElement>;

  @Input() data: Candle[] = [];
  @Input() options: ChartOptions = {};
  @Input() showVolume = false;
  @Input() loading = false;
  @Input() theme: 'light' | 'dark' = 'dark';

  @Output() chartReady = new EventEmitter<void>();

  private isInitialized = false;

  ngAfterViewInit() {
    // Only initialize in browser
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Initialize chart
    this.initializeChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isInitialized) return;

    // Update data
    if (changes['data'] && changes['data'].currentValue.length > 0) {
      const candles = changes['data'].currentValue as Candle[];
      this.chartFacade.setData(candles);

      if (this.showVolume) {
        this.chartFacade.setVolumeData(candles);
      }

      this.chartFacade.fitContent();
    }

    // Update theme
    if (changes['theme']) {
      this.chartFacade.applyTheme(this.theme);
    }

    // Toggle volume
    if (changes['showVolume'] && this.data.length > 0) {
      if (this.showVolume) {
        this.chartFacade.setVolumeData(this.data);
      }
    }
  }

  /**
   * Update single candle (for real-time updates)
   */
  updateCandle(candle: Candle): void {
    this.chartFacade.updateCandle(candle);
  }

  /**
   * Fit chart to content
   */
  fitContent(): void {
    this.chartFacade.fitContent();
  }

  /**
   * Add indicator line
   */
  addIndicator(id: string, color?: string): void {
    this.chartFacade.addIndicator(id, color);
  }

  /**
   * Remove indicator
   */
  removeIndicator(id: string): void {
    this.chartFacade.removeIndicator(id);
  }

  private initializeChart(): void {
    const container = this.chartContainer.nativeElement;

    this.chartFacade.initialize(container, {
      ...this.options,
      theme: this.theme,
    });

    if (this.data.length > 0) {
      this.chartFacade.setData(this.data);

      if (this.showVolume) {
        this.chartFacade.setVolumeData(this.data);
      }

      this.chartFacade.fitContent();
    }

    this.isInitialized = true;
    this.chartReady.emit();
  }
}
