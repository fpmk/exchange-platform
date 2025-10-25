import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { orderbookStore } from '../store/orderbook.store';

@Component({
  selector: 'lib-orderbook-widget',
  imports: [],
  templateUrl: './orderbook.html',
  styleUrl: './orderbook.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Orderbook {
  orderbookStore = inject(orderbookStore);
}
