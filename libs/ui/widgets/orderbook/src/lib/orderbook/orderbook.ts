import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { AppStore, ChartStore, TradeStore } from '@exchange-platform/state';
import { OrderBookFacade } from '../facades/order-book.facade';
import { DecimalPipe } from '@angular/common';
import { RegisterWidget } from '@exchange-platform/widget-system';

@RegisterWidget({
  type: 'orderbook',
  name: 'Order book',
  description: 'Order book widget',
  icon: 'orderbook',
  category: 'market',
  defaultConfig: {
    title: 'OrderBook',
    resizable: true,
    closable: false,
    minWidth: 400,
    minHeight: 300,
    settings: {
      levels: 10
    },
  },
})
@Component({
  selector: 'lib-orderbook-widget',
  providers: [OrderBookFacade],
  imports: [DecimalPipe],
  templateUrl: './orderbook.html',
  styleUrl: './orderbook.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Orderbook {
  private readonly appState = inject(AppStore);
  private readonly orderBookFacade = inject(OrderBookFacade);
  protected readonly chartStore = inject(ChartStore);
  protected readonly tradeStore = inject(TradeStore);

  constructor() {
    effect(() => {
      const symbol = this.appState.selectedSymbol();
      console.log('Orderbook facade:', symbol);
      this.orderBookFacade.loadOrderbook(symbol);
    });
    effect(() => {
      const bids = this.tradeStore.orderBook.bids();
      const asks = this.tradeStore.orderBook.asks();
    });
  }
}
