import { DestroyRef, inject, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExchangeWebSocketStore } from '@exchange-platform/state';
import { ExchangeWebsocketPort } from '@exchange-platform/ports';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private readonly _wsStore = inject(ExchangeWebSocketStore);
  private readonly _wsPort = inject(ExchangeWebsocketPort);
  private readonly _destroyRef = inject(DestroyRef);

  private _connectionSubscription: Subscription = Subscription.EMPTY;

  public connect(): void {
    const currentStatus = this._wsStore.status();

    if (currentStatus === 'connected' || currentStatus === 'connecting') {
      console.log('Already connected or connecting');
      return;
    }
    console.log('Connecting to WebSocket...');
    this._wsStore.setConnecting();

    // Cleanup previous connection if exists
    this.cleanupConnection();

    this._connectionSubscription = this._wsPort
      .connect()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (event) => {
          if (event.status === 'connected') {
            this._wsStore.setConnected(event.timestamp);
            console.log(
              'WebSocket connected at',
              new Date(event.timestamp).toISOString()
            );
          } else if (event.status === 'error') {
            const errorMessage =
              event.error || 'Unknown WebSocket error occurred';
            this._wsStore.setError(errorMessage);
            console.error('WebSocket error:', errorMessage);
          } else {
            this._wsStore.setStatus(event.status);
          }
        },
        error: (error) => {
          const errorMessage =
            error?.message ||
            error?.toString() ||
            'WebSocket connection failed with unknown error';
          this._wsStore.setError(
            errorMessage,
            this._wsStore.reconnectAttempts() + 1
          );
          console.error('WebSocket connection failed:', errorMessage, error);
          this.cleanupConnection();
        },
        complete: () => {
          console.log('WebSocket stream completed');
          this.cleanupConnection();
        },
      });
  }

  public disconnect(reason?: string): void {
    console.log('Disconnecting WebSocket...', reason ? `(${reason})` : '');
    this._wsPort.disconnect();
    this.cleanupConnection();
    this._wsStore.setDisconnected(reason || null);
  }

  public reconnect(delayMs = 1000): void {
    console.log(`Reconnecting in ${delayMs}ms...`);

    this.disconnect('Manual reconnect');

    setTimeout(() => {
      this._wsStore.increateAttempts();
      this.connect();
    }, delayMs);
  }

  private cleanupConnection(): void {
    if (!this._connectionSubscription.closed) {
      this._connectionSubscription.unsubscribe();
      this._connectionSubscription = Subscription.EMPTY;
    }
  }
}
