import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-market-watch',
  imports: [],
  templateUrl: './market-watch.html',
  styleUrl: './market-watch.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketWatch {}
