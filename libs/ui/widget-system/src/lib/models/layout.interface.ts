import { Widget } from './widget.interface';

export interface Layout {
  id: string;
  name: string;
  widgets: Widget[];
  settings: LayoutSettings;
  createdAt: number;
  updatedAt: number;
}

export interface LayoutSettings {
  columns: number;
  rowHeight: number;
  draggable: boolean;
  resizable: boolean;
  responsive: boolean;
}
