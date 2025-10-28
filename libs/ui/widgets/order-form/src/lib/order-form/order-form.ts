import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { RegisterWidget } from '@exchange-platform/widget-system';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppStore, TradeStore } from '@exchange-platform/state';
import { OrderFormFacade } from '../facades/order-form.facade';
import { OrderSide } from '@exchange-platform/trading';

@RegisterWidget({
  type: 'order-form',
  name: 'Order book form',
  description: 'Order book form widget',
  icon: 'orderbook-form',
  category: 'market',
  defaultConfig: {
    title: 'OrderBook Form',
    resizable: true,
    closable: false,
    minWidth: 400,
    minHeight: 300,
    settings: {},
  },
})
@Component({
  selector: 'lib-order-form',
  imports: [ReactiveFormsModule],
  providers: [OrderFormFacade],
  templateUrl: './order-form.html',
  styleUrl: './order-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderForm implements OnInit {
  protected orderForm: FormGroup;
  private readonly fb = inject(FormBuilder);
  private readonly tradeStore = inject(TradeStore);
  private readonly appStore = inject(AppStore);
  private readonly orderFormFacade = inject(OrderFormFacade);

  constructor() {
    this.orderForm = this.fb.group({
      price: new FormControl(null, [Validators.required]),
      size: new FormControl(null, [Validators.required]),
    });
    effect(() => {
      this.orderForm.patchValue({
        price: this.tradeStore.orderForm.lastPrice(),
      });
    });
  }

  ngOnInit() {
    console.log('');
  }

  placeOrder(side: OrderSide) {
    this.orderFormFacade.placeOrder({
      clientOrderId: '1',
      price: this.orderForm.get('price')?.value,
      quantity: this.orderForm.get('size')?.value,
      symbol: this.appStore.selectedSymbol(),
      type: 'MARKET',
      side,
    });
  }
}
