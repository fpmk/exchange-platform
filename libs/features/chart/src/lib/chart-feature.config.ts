import { Provider } from '@angular/core';
import { ChartRendererPort } from './domain/ports/chart-renderer.port';
import { LightweightChartAdapter } from './infrastructure/lightweight-charts/lightweight-chart.adapter';

export const CHART_FEATURE_PROVIDERS: Provider[] = [
  {
    provide: ChartRendererPort,
    useClass: LightweightChartAdapter, // ← Switch implementation here
  },
];

// export const CHART_FEATURE_PROVIDERS: Provider[] = [
//   {
//     provide: ChartRendererPort,
//     useFactory: (config: AppConfig) => {
//       // Choose implementation based on config/feature flag
//       return config.useExperimentalChart
//         ? new NewChartAdapter()
//         : new LightweightChartAdapter();
//     },
//     deps: [AppConfig],
//   },
// ];
