/**
 * Chart Feature - Public API
 *
 * This barrel export defines what is accessible from outside the feature.
 * Internal implementation details remain encapsulated.
 */

// UI Layer (Widget Component)
export * from './lib/ui/chart.component';

// Feature Configuration
export * from './lib/chart-feature.config';

// Domain Layer
export type { ChartRendererPort } from './lib/domain/ports/chart-renderer.port';
export type { ChartOptions, ChartSeriesConfig, IndicatorConfig } from './lib/domain/models/chart-data.model';

// Application Layer (for testing/advanced use)
export { ChartFacade } from './lib/application/facades/chart.facade';
