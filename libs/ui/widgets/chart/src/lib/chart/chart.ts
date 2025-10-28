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
import { Candle, CandleInterval } from '@exchange-platform/market';
import { AppStore, ChartStore } from '@exchange-platform/state';
import { SymbolSelector } from '@exchange-platform/symbol-selector';
import { ChartFacade } from '../facades/chart.facade';
import { ChartComponent } from '@exchange-platform/feature-chart';

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
  imports: [
    CommonModule,
    SymbolSelector,
    ChartComponent,
    ChartComponent,
    ChartComponent,
  ],
  providers: [ChartFacade],
  templateUrl: './chart.html',
  styleUrl: './chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartWidgetComponent implements OnInit {
  @ViewChild('chart') chartComponent!: ChartComponent;

  protected readonly store = inject(ChartStore);
  protected readonly chartFacade = inject(ChartFacade);
  protected readonly appState = inject(AppStore);

  // UI State
  protected showVolume = signal(false);

  // Computed chart data
  protected chartData = signal<Candle[]>([]);

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
        if (!this.chartData().length) {
          this.chartData.set(storeCandles);
        } else {
          const lastNew = storeCandles[storeCandles.length - 1];
          this.chartComponent?.updateCandle(lastNew);
        }
      });
    });
    effect(() => {
      const symbol = this.appState.selectedSymbol();
      this.chartData.set([]);
    });
    effect(() => {
      const interval = this.store.interval();
      this.chartData.set([]);
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
