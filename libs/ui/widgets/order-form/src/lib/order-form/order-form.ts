import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-order-form',
  imports: [],
  templateUrl: './order-form.html',
  styleUrl: './order-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderForm {}
