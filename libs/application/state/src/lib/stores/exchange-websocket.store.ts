import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ConnectionStatus } from '@exchange-platform/ports';

interface ExchangeWebSocketState {
  status: ConnectionStatus;
  error: string | null;
  connectedAt: number | null;
  reconnectAttempts: number;
  lastDisconnectReason: string | null;
}

const INITIAL_STATE: ExchangeWebSocketState = {
  status: 'disconnected',
  error: null,
  connectedAt: null,
  reconnectAttempts: 0,
  lastDisconnectReason: null,
};

export const ExchangeWebSocketStore = signalStore(
  { providedIn: 'root' },

  withState(INITIAL_STATE),

  withComputed((store) => ({
    isConnected: computed(() => store.status() === 'connected'),
    isConnecting: computed(() => store.status() === 'connecting'),
    isDisconnected: computed(() => store.status() === 'disconnected'),
    isError: computed(() => store.status() === 'error'),
    hasError: computed(() => store.error() !== null),

    // Connection duration in seconds
    connectionDuration: computed(() => {
      const connectedAt = store.connectedAt();
      if (!connectedAt) return 0;
      return Math.floor((Date.now() - connectedAt) / 1000);
    }),

    // Connection info for debugging
    connectionInfo: computed(() => ({
      status: store.status(),
      connectedAt: store.connectedAt(),
      error: store.error(),
      reconnectAttempts: store.reconnectAttempts(),
    })),
  })),

  withMethods((store) => {
    return {
      setConnecting(): void {
        patchState(store, {
          status: 'connecting',
          error: null,
        });
      },
      setConnected(timestamp: number): void {
        patchState(store, {
          status: 'connected',
          connectedAt: timestamp,
          error: null,
          reconnectAttempts: 0,
          lastDisconnectReason: null,
        });
      },
      setError(message: string, reconnectAttempts?: number): void {
        patchState(store, {
          status: 'error',
          error: message,
          reconnectAttempts,
        });
      },
      setStatus(status: ConnectionStatus): void {
        patchState(store, { status });
      },
      setDisconnected(reason: string | null): void {
        patchState(store, {
          status: 'disconnected',
          connectedAt: null,
          lastDisconnectReason: reason || null,
        });
      },
      increateAttempts(): void {
        patchState(store, {
          reconnectAttempts: store.reconnectAttempts() + 1,
        });
      },
      clearError(): void {
        patchState(store, { error: null });
      },
      resetReconnectAttempts(): void {
        patchState(store, { reconnectAttempts: 0 });
      },
    };
  })
);
