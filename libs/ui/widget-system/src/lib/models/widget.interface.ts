export interface Widget {
  id: string;
  type: WidgetType;
  config: WidgetConfig;
  position: WidgetPosition;
}

export interface WidgetConfig {
  title: string;
  icon?: string;
  resizable?: boolean;
  closable?: boolean;
  minWidth?: number;
  minHeight?: number;
  settings?: Record<string, unknown>;
}

export interface WidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type WidgetType =
  | 'chart'
  | 'orderbook'
  | 'order-form'
  | 'orders-list'
  | 'balance'
  | 'symbol-selector'
  | 'ticker'
  | 'market-watch';

/**
 * Lifecycle hooks для виджетов
 */
export interface WidgetComponent {
  onInit?(): void;

  onDestroy?(): void;

  onResize?(width: number, height: number): void;

  onSettingsChange?(settings: unknown): void;
}
