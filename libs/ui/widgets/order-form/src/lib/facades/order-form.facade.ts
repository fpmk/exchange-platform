import { DestroyRef, inject, Injectable } from '@angular/core';
import {
  PlaceOrderCommand,
  PlaceOrderUseCase,
} from '@exchange-platform/trading-use-cases';
import { TradeStore } from '@exchange-platform/state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class OrderFormFacade {
  private readonly destroyRef = inject(DestroyRef);
  private readonly createOrder = inject(PlaceOrderUseCase);
  private readonly tradeStore = inject(TradeStore);

  placeOrder(command: PlaceOrderCommand): void {
    this.createOrder.execute(command, this.tradeStore.balance())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
