import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStore } from '@exchange-platform/state';
import { Orderbook } from '@exchange-platform/orderbook';
import { ChartWidgetComponent } from '@exchange-platform/chart';
import { OrderForm } from '@exchange-platform/order-form';
import { WebsocketService } from '@exchange-platform/application-services';
import { Header } from '@exchange-platform/header';

@Component({
  standalone: true,
  imports: [CommonModule, ChartWidgetComponent, Orderbook, OrderForm, Header],
  selector: 'app-trading',
  templateUrl: './trading.html',
  styleUrl: './trading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradingPage implements OnInit {
  protected readonly appState = inject(AppStore);
  private readonly wsService = inject(WebsocketService);

  ngOnInit() {
    this.wsService.connect();
    this.appState.markAsInitialized();
  }
}
