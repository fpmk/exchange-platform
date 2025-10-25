import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-orders-list',
  imports: [],
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersList {}
