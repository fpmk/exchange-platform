import { Type } from '@angular/core';
import { WidgetConfig, WidgetType } from './widget.interface';

export interface WidgetMetadata {
  type: WidgetType;
  name: string;
  description: string;
  icon: string;
  category: WidgetCategory;
  component: Type<any>;
  defaultConfig: WidgetConfig;
  previewImage?: string;
}

export type WidgetCategory = 'market' | 'trading' | 'portfolio' | 'tools';
