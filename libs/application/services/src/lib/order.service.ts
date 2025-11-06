import { DestroyRef, inject, Injectable } from '@angular/core';
import {
  PlaceOrderQuery,
  PlaceOrderUseCase,
} from '@exchange-platform/trading-use-cases';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly createOrder = inject(PlaceOrderUseCase);

  placeOrder(command: PlaceOrderQuery): void {
    this.createOrder
      .execute(command)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        console.log('Order placed successfully.');
      });
  }
}
