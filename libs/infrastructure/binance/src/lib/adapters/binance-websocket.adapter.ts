import { DestroyRef, inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject, throwError, timer } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { map, retry, shareReplay, takeUntil, tap } from 'rxjs/operators';
import { ConnectionEvent, ConnectionStatus, ExchangeWebsocketPort } from '@exchange-platform/ports';
import { BINANCE_ENVIRONMENTS, DEFAULT_BINANCE_CONFIG } from '../config/binance.config';

/**
 * Binance WebSocket Adapter
 * Implements WebSocketPort interface
 */
@Injectable()
export class BinanceWebSocketAdapter implements ExchangeWebsocketPort {
  private destroyRef = inject(DestroyRef);

  private connections = new Map<string, WebSocketSubject<any>>();
  private connectionEvent$ = new ReplaySubject<ConnectionEvent>(1);
  private destroy$ = new Subject<void>();

  private currentStatus: ConnectionStatus = 'disconnected';
  private readonly config = DEFAULT_BINANCE_CONFIG;
  private readonly env = BINANCE_ENVIRONMENTS[this.config.environment];

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.destroy$.next();
      this.destroy$.complete();
      this.disconnect();
    });
  }

  connect(): Observable<ConnectionEvent> {
    console.log(
      `Binance WebSocket: Connecting to ${this.config.environment}...`
    );

    this.updateStatus('connecting');

    // Binance doesn't have a "global" connection, it connects per stream
    // We'll simulate successful connection
    setTimeout(() => {
      this.updateStatus('connected');
    }, 100);

    return this.connectionEvent$.asObservable();
  }

  disconnect(): void {
    console.log('Binance WebSocket: Disconnecting all streams...');

    this.connections.forEach((ws, channel) => {
      console.log(`  Closing ${channel}`);
      ws.complete();
    });

    this.connections.clear();
    this.updateStatus('disconnected');
  }

  subscribe<T>(channel: string): Observable<T> {
    console.log(`Subscribing to: ${channel}`);

    const existing = this.connections.get(channel);
    if (existing) {
      console.log(`  Reusing existing subscription`);
      return existing.asObservable() as Observable<T>;
    }

    const ws$ = this.createWebSocket<T>(channel);
    this.connections.set(channel, ws$);

    return ws$.asObservable().pipe(
      retry({
        delay: (error, retryCount) => {
          // Check if error is recoverable
          if (!this.isRecoverableError(error)) {
            console.error(`Non-recoverable WS Error (${channel}):`, error);
            this.updateStatus(
              'error',
              error.message || 'Non-recoverable error'
            );
            return throwError(() => error);
          }

          // Exponential backoff with max attempts
          const maxRetries = 5;
          if (retryCount >= maxRetries) {
            console.error(
              `Max retries (${maxRetries}) exceeded for ${channel}:`,
              error
            );
            this.updateStatus(
              'error',
              `Max retries exceeded: ${error.message || 'Connection failed'}`
            );
            return throwError(
              () =>
                new Error(`Max retries exceeded after ${retryCount} attempts`)
            );
          }

          const delayMs = Math.min(1000 * Math.pow(2, retryCount), 30000); // Max 30 seconds
          console.error(
            `WS Error (${channel}) - Retry ${retryCount}/${maxRetries}:`,
            error
          );
          console.log(`Reconnecting to ${channel} in ${delayMs}ms...`);
          this.updateStatus('connecting');
          return timer(delayMs);
        },
      }),
      tap({
        next: () => {
          if (this.currentStatus !== 'connected') {
            this.updateStatus('connected');
          }
        },
        error: (err) => {
          console.error(`Stream error (${channel}):`, err);
          this.updateStatus('error', err.message || 'Stream error');
        },
      }),
      takeUntil(this.destroy$),
      shareReplay({ bufferSize: 1, refCount: true })
    ) as Observable<T>;
  }

  unsubscribe(channel: string): void {
    const ws = this.connections.get(channel);
    if (ws) {
      console.log(`Unsubscribing from: ${channel}`);
      ws.complete();
      this.connections.delete(channel);

      // If no more connections, update status
      if (this.connections.size === 0) {
        this.updateStatus('disconnected');
      }
    }
  }

  getConnectionStatus(): Observable<ConnectionStatus> {
    return this.connectionEvent$.pipe(map((event) => event.status));
  }

  private createWebSocket<T>(streamName: string): WebSocketSubject<T> {
    const url = `${this.env.wsStreamUrl}/${streamName}`;

    console.log(`Creating WebSocket connection to: ${url}`);

    return webSocket<T>({
      url,
      openObserver: {
        next: () => {
          console.log(`Stream opened: ${streamName}`);
          this.updateStatus('connected');
        },
      },
      closeObserver: {
        next: (event) => {
          // console.log(`Stream closed: ${streamName}`, event);
          this.connections.delete(streamName);

          // If no more connections, update status
          if (this.connections.size === 0) {
            this.updateStatus('disconnected');
          }
        },
      },
      serializer: (value) => JSON.stringify(value),
      deserializer: (event) => {
        try {
          return JSON.parse(event.data);
        } catch (error) {
          console.error(
            `Failed to parse WebSocket message:`,
            event.data,
            error
          );
          throw error;
        }
      },
    });
  }

  private updateStatus(status: ConnectionStatus, error?: string): void {
    this.currentStatus = status;
    this.connectionEvent$.next({
      status,
      timestamp: Date.now(),
      error,
    });
  }

  private isRecoverableError(error: any): boolean {
    if (!error) return false;

    const message = error.message || error.toString() || '';
    const lowerMessage = message.toLowerCase();

    const recoverableErrors = [
      'connection refused',
      'connection reset',
      'connection timeout',
      'network error',
      'websocket error',
      'unexpected end of stream',
      'connection lost',
      'server unavailable',
      'temporary failure',
      'service unavailable',
      'timeout',
      'econnrefused',
      'enotfound',
      'etimedout',
      'econnreset',
    ];

    const isRecoverable = recoverableErrors.some((pattern) =>
      lowerMessage.includes(pattern)
    );

    if (isRecoverable) {
      return true;
    }
    // Check for specific HTTP-like status codes in WebSocket errors
    if (error.status) {
      const status = parseInt(error.status);
      // 5xx server errors are usually recoverable
      if (status >= 500 && status < 600) {
        return true;
      }
      // 429 rate limiting is recoverable
      if (status === 429) {
        return true;
      }
    }
    if (error.code) {
      const code = parseInt(error.code);
      // Close codes 1000-1015 are generally recoverable (except 1000 normal closure)
      if (code >= 1001 && code <= 1015) {
        return true;
      }
    }
    console.warn(`Unknown error type, treating as non-recoverable:`, error);
    return false;
  }
}
