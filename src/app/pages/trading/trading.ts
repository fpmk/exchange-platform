import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStore, ExchangeWebSocketStore } from '@exchange-platform/state';
import { Orderbook } from '@exchange-platform/orderbook';
import { ChartWidgetComponent } from '@exchange-platform/chart';
import { OrderForm } from '@exchange-platform/order-form';
import { WebsocketService } from '@exchange-platform/application-services';

@Component({
  standalone: true,
  imports: [CommonModule, ChartWidgetComponent, Orderbook, OrderForm],
  selector: 'app-trading',
  templateUrl: './trading.html',
  styleUrl: './trading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradingPage implements OnInit {
  protected readonly appState = inject(AppStore);
  protected readonly wsStore = inject(ExchangeWebSocketStore);
  private readonly wsService = inject(WebsocketService);

  ngOnInit() {
    this.wsService.connect();
    this.appState.markAsInitialized();
  }

  protected toggleTheme() {
    const newTheme = this.appState.theme() === 'dark' ? 'light' : 'dark';
    this.appState.setTheme(newTheme);
  }
}
