import { Injectable } from '@angular/core';
import { WidgetMetadata } from '../models/widget-metadata.interface';
import { WidgetType } from '../models/widget.interface';
import { getWidgetRegistry } from '../decorators/register-widget.decorator';

@Injectable({ providedIn: 'root' })
export class WidgetRegistryService {
  private registry = getWidgetRegistry();

  getWidget(type: WidgetType): WidgetMetadata | undefined {
    return this.registry.get(type);
  }

  getAllWidgets(): WidgetMetadata[] {
    return Array.from(this.registry.values());
  }

  getWidgetsByCategory(category: string): WidgetMetadata[] {
    return this.getAllWidgets().filter((w) => w.category === category);
  }

  hasWidget(type: WidgetType): boolean {
    return this.registry.has(type);
  }
}
