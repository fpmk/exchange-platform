import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
  untracked,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterWidget } from '@exchange-platform/widget-system';
import { CandleInterval } from '@exchange-platform/market';
import { AppStore } from '@exchange-platform/state';
import { SymbolSelector } from '@exchange-platform/symbol-selector';
import {
  CandlestickData,
  ChartComponent,
  VolumeData,
} from '@exchange-platform/chart-ui';
import { ChartStore } from '../store/chart.store';
import { ChartFacade } from '../facades/chart.facade';
import { CandleMapperPort } from '@exchange-platform/ports';

@RegisterWidget({
  type: 'chart',
  name: 'Trading Chart',
  description: 'Candlestick chart with real-time updates',
  icon: 'chart-line',
  category: 'market',
  defaultConfig: {
    title: 'Chart',
    resizable: true,
    closable: false,
    minWidth: 400,
    minHeight: 300,
    settings: {
      interval: '1h',
      showVolume: true,
      showGrid: true,
    },
  },
})
@Component({
  selector: 'lib-chart-widget',
  standalone: true,
  imports: [CommonModule, SymbolSelector, ChartComponent, ChartComponent],
  providers: [ChartStore, ChartFacade],
  templateUrl: './chart.html',
  styleUrl: './chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartWidgetComponent implements OnInit {
  @ViewChild('chart') chartComponent!: ChartComponent;

  protected readonly store = inject(ChartStore);
  protected readonly chartFacade = inject(ChartFacade);
  protected readonly appState = inject(AppStore);
  protected readonly candleMapper = inject(CandleMapperPort);

  // UI State
  protected showVolume = signal(false);

  // Computed chart data
  protected chartData = signal<CandlestickData[]>([]);
  protected volumeData = signal<VolumeData[]>([]);

  protected readonly intervals: CandleInterval[] = [
    '1m',
    '5m',
    '15m',
    '1h',
    '4h',
    '1d',
  ];

  constructor() {
    effect(() => {
      const storeCandles = this.store.candles();
      untracked(() => {
        const candles = storeCandles.map((c) =>
          this.candleMapper.toChartData(c)
        );
        const volumes = storeCandles.map((c) =>
          this.candleMapper.toVolumeData(c)
        );
        if (!this.chartData().length) {
          this.chartData.set(candles);
          this.volumeData.set(volumes);
        } else {
          const lastNew = candles[candles.length - 1];
          this.chartComponent?.updateCandle(lastNew);
        }
      });
    });
    effect(() => {
      const symbol = this.appState.selectedSymbol();
      this.chartData.set([]);
      this.volumeData.set([]);
    });
    effect(() => {
      const interval = this.store.interval();
      this.chartData.set([]);
      this.volumeData.set([]);
      this.chartFacade.changeCandleInterval(interval);
    });
  }

  ngOnInit() {
    console.log('Chart Widget initialized');
  }

  protected toggleVolume(): void {
    this.showVolume.update((v) => !v);
  }

  protected onChartReady(): void {
    console.log('Chart is ready');
  }

  protected formatVolume(volume: number): string {
    if (volume >= 1_000_000) {
      return `${(volume / 1_000_000).toFixed(2)}M`;
    }
    if (volume >= 1_000) {
      return `${(volume / 1_000).toFixed(2)}K`;
    }
    return volume.toFixed(2);
  }
}
