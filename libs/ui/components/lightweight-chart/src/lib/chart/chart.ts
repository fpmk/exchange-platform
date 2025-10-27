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
import { ChartService } from '../services/chart.service';
import {
  CandlestickData,
  ChartOptions,
  VolumeData,
} from '../types/chart-options.types';

@Component({
  selector: 'lib-lightweight-chart',
  standalone: true,
  providers: [ChartService],
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
        display: block;
        width: 100%;
        height: 100%;
      }

      .chart-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnChanges, AfterViewInit {
  private readonly chartService = inject(ChartService);
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('chartContainer', { static: true })
  chartContainer!: ElementRef<HTMLElement>;

  @Input() data: CandlestickData[] = [];
  @Input() volumeData: VolumeData[] = [];
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
      this.chartService.setCandlestickData(changes['data'].currentValue);
      this.chartService.fitContent();
    }

    // Update volume
    if (changes['volumeData'] && this.showVolume) {
      this.chartService.setVolumeData(this.volumeData);
    }

    // Update theme
    if (changes['theme']) {
      this.chartService.applyTheme(this.theme);
    }

    // Toggle volume
    if (changes['showVolume']) {
      if (this.showVolume && this.volumeData.length > 0) {
        this.chartService.addVolumeSeries();
        this.chartService.setVolumeData(this.volumeData);
      }
    }
  }

  /**
   * Update single candle (for real-time updates)
   */
  updateCandle(candle: CandlestickData): void {
    this.chartService.updateCandle(candle);
  }

  /**
   * Fit chart to content
   */
  fitContent(): void {
    this.chartService.fitContent();
  }

  /**
   * Add indicator line
   */
  addIndicator(id: string, color?: string): void {
    this.chartService.addIndicator(id, color);
  }

  /**
   * Remove indicator
   */
  removeIndicator(id: string): void {
    this.chartService.removeIndicator(id);
  }

  private initializeChart(): void {
    const container = this.chartContainer.nativeElement;

    this.chartService.initialize(container, {
      ...this.options,
      theme: this.theme,
    });

    if (this.showVolume) {
      this.chartService.addVolumeSeries();
    }

    if (this.data.length > 0) {
      this.chartService.setCandlestickData(this.data);
      this.chartService.fitContent();
    }

    if (this.volumeData.length > 0 && this.showVolume) {
      this.chartService.setVolumeData(this.volumeData);
    }

    this.isInitialized = true;
    this.chartReady.emit();
  }
}
