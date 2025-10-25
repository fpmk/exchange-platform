import { Type } from '@angular/core';
import { WidgetMetadata } from '../models/widget-metadata.interface';

const WIDGET_REGISTRY = new Map<string, WidgetMetadata>();

/**
 * Декоратор для регистрации виджетов
 */
export function RegisterWidget(metadata: Omit<WidgetMetadata, 'component'>) {
  return function <T extends Type<any>>(target: T): T {
    const fullMetadata: WidgetMetadata = {
      ...metadata,
      component: target,
    };

    WIDGET_REGISTRY.set(metadata.type, fullMetadata);

    console.log(`* Widget registered: ${metadata.type}`);

    return target;
  };
}

export function getWidgetRegistry(): Map<string, WidgetMetadata> {
  return WIDGET_REGISTRY;
}
