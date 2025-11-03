import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WsMarketDataPort } from '@exchange-platform/ports';
import { Candle, CandleInterval } from '@exchange-platform/market';

export interface SubscribeToCandlesCommand {
  symbol: string;
  interval: CandleInterval;
}

/**
 * Use Case: Subscribe to Real-time Candles
 * Used for live chart updates
 */
@Injectable({ providedIn: 'root' })
export class SubscribeToCandlesUseCase {
  private readonly _wsMarketDataPort = inject(WsMarketDataPort);

  execute(command: SubscribeToCandlesCommand): Observable<Candle> {
    this.validate(command);

    console.log(
      `Subscribing to candles: ${command.symbol} ${command.interval}`
    );

    return this._wsMarketDataPort.subscribeToCandleUpdates(
      command.symbol,
      command.interval
    );
  }

  private validate(command: SubscribeToCandlesCommand): void {
    if (!command.symbol) {
      throw new Error('Symbol is required');
    }
    if (!command.interval) {
      throw new Error('Interval is required');
    }
  }
}
