// Backward compatibility: Service wrapper (optional)
import { computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ConnectionStatus, WebSocketPort } from '@exchange-platform/ports';
import { Subscription } from 'rxjs';

interface WebSocketState {
  status: ConnectionStatus;
  error: string | null;
  connectedAt: number | null;
  reconnectAttempts: number;
  lastDisconnectReason: string | null;
}

const INITIAL_STATE: WebSocketState = {
  status: 'disconnected',
  error: null,
  connectedAt: null,
  reconnectAttempts: 0,
  lastDisconnectReason: null,
};

export const WebSocketStore = signalStore(
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

  withMethods(
    (
      store,
      wsPort = inject(WebSocketPort),
      destroyRef = inject(DestroyRef)
    ) => {
      let connectionSubscription: Subscription = Subscription.EMPTY;

      const cleanupConnection = () => {
        if (!connectionSubscription.closed) {
          connectionSubscription.unsubscribe();
          connectionSubscription = Subscription.EMPTY;
        }
      };

      return {
        /**
         * Connect to WebSocket
         */
        connect(): void {
          const currentStatus = store.status();

          if (currentStatus === 'connected' || currentStatus === 'connecting') {
            console.log('Already connected or connecting');
            return;
          }

          console.log('Connecting to WebSocket...');
          patchState(store, {
            status: 'connecting',
            error: null,
          });

          // Cleanup previous connection if exists
          cleanupConnection();

          connectionSubscription = wsPort
            .connect()
            .pipe(takeUntilDestroyed(destroyRef))
            .subscribe({
              next: (event) => {
                // console.log('WebSocket event:', event);

                if (event.status === 'connected') {
                  patchState(store, {
                    status: 'connected',
                    connectedAt: event.timestamp,
                    error: null,
                    reconnectAttempts: 0,
                    lastDisconnectReason: null,
                  });
                  console.log(
                    'WebSocket connected at',
                    new Date(event.timestamp).toISOString()
                  );
                } else if (event.status === 'error') {
                  const errorMessage =
                    event.error || 'Unknown WebSocket error occurred';
                  patchState(store, {
                    status: 'error',
                    error: errorMessage,
                  });
                  console.error('WebSocket error:', errorMessage);
                } else {
                  // Handle other statuses (disconnected, reconnecting, etc.)
                  patchState(store, { status: event.status });
                }
              },
              error: (error) => {
                const errorMessage =
                  error?.message ||
                  error?.toString() ||
                  'WebSocket connection failed with unknown error';

                patchState(store, {
                  status: 'error',
                  error: errorMessage,
                  reconnectAttempts: store.reconnectAttempts() + 1,
                });

                console.error(
                  'WebSocket connection failed:',
                  errorMessage,
                  error
                );
                cleanupConnection();
              },
              complete: () => {
                console.log('WebSocket stream completed');
                cleanupConnection();
              },
            });
        },

        /**
         * Disconnect from WebSocket
         */
        disconnect(reason?: string): void {
          console.log(
            'Disconnecting WebSocket...',
            reason ? `(${reason})` : ''
          );

          cleanupConnection();
          wsPort.disconnect();

          patchState(store, {
            status: 'disconnected',
            connectedAt: null,
            lastDisconnectReason: reason || null,
          });
        },

        /**
         * Reconnect to WebSocket
         */
        reconnect(delayMs = 1000): void {
          console.log(`Reconnecting in ${delayMs}ms...`);

          this.disconnect('Manual reconnect');

          setTimeout(() => {
            patchState(store, {
              reconnectAttempts: store.reconnectAttempts() + 1,
            });
            this.connect();
          }, delayMs);
        },

        /**
         * Clear error state
         */
        clearError(): void {
          patchState(store, { error: null });
        },

        /**
         * Reset reconnect attempts counter
         */
        resetReconnectAttempts(): void {
          patchState(store, { reconnectAttempts: 0 });
        },

        /**
         * Cleanup method (exposed for manual cleanup if needed)
         */
        cleanup(): void {
          cleanupConnection();
        },
      };
    }
  ),

  withHooks({
    onInit(store) {
      console.log('WebSocket Store initialized');

      // Auto-connect on initialization
      store.connect();
    },

    onDestroy(store) {
      console.log('WebSocket Store destroyed');
      store.disconnect('Store destroyed');
      store.cleanup();
    },
  })
);
