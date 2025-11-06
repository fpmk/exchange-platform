import { computed, effect, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { StoragePort } from '@exchange-platform/ports';
import { WalletAccount } from '@exchange-platform/wallet';

export interface AppState {
  selectedSymbol: string;
  connectedAccount: WalletAccount | null;
  theme: 'light' | 'dark';
  isInitialized: boolean;
}

const INITIAL_STATE: AppState = {
  selectedSymbol: 'BTCUSDT',
  connectedAccount: {} as WalletAccount,
  theme: 'dark',
  isInitialized: false,
};

const STORAGE_KEY = 'app-state';

/**
 * Global Application State
 */
export const AppStore = signalStore(
  { providedIn: 'root' },

  withState(INITIAL_STATE),

  withComputed((store) => ({
    // Additional computed values if needed
    isDarkTheme: computed(() => store.theme() === 'dark'),
    isLightTheme: computed(() => store.theme() === 'light'),
  })),

  withMethods((store, storage = inject(StoragePort)) => ({
    /**
     * Select a trading symbol
     */
    selectSymbol(symbol: string): void {
      const normalized = symbol.toUpperCase();
      console.log(`Symbol selected: ${normalized}`);
      patchState(store, { selectedSymbol: normalized });
    },

    /**
     * Change application theme
     */
    setTheme(theme: 'light' | 'dark'): void {
      console.log(`Theme changed: ${theme}`);
      patchState(store, { theme });
    },

    /**
     * Set account
     */
    setAccount(account: WalletAccount | null): void {
      patchState(store, { connectedAccount: account });
    },

    /**
     * Toggle between light and dark theme
     */
    toggleTheme(): void {
      const newTheme = store.theme() === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
    },

    /**
     * Mark application as initialized
     */
    markAsInitialized(): void {
      patchState(store, { isInitialized: true });
    },

    /**
     * Reset state to initial values
     */
    reset(): void {
      patchState(store, INITIAL_STATE);
      this.clearStorage();
    },

    /**
     * Save current state to storage
     */
    saveToStorage(): void {
      try {
        const state: AppState = {
          selectedSymbol: store.selectedSymbol(),
          connectedAccount: store.connectedAccount(),
          theme: store.theme(),
          isInitialized: store.isInitialized(),
        };
        storage.set(STORAGE_KEY, state);
      } catch (error) {
        console.error('Failed to save state to storage:', error);
      }
    },

    /**
     * Load state from storage
     */
    loadFromStorage(): void {
      try {
        const stored = storage.get<Partial<AppState>>(STORAGE_KEY);
        if (stored) {
          patchState(store, {
            ...INITIAL_STATE,
            ...stored,
          });
          console.log('State loaded from storage');
        }
      } catch (error) {
        console.error('Failed to load state from storage:', error);
      }
    },

    /**
     * Clear state from storage
     */
    clearStorage(): void {
      try {
        storage.remove(STORAGE_KEY);
        console.log('State cleared from storage');
      } catch (error) {
        console.error('Failed to clear storage:', error);
      }
    },
  })),

  withHooks({
    onInit(store) {
      console.log('App State Store initialized');

      // Load state from storage on initialization
      store.loadFromStorage();

      // Auto-save state to storage whenever it changes
      effect(() => {
        // Track all state properties
        const selectedSymbol = store.selectedSymbol();
        const theme = store.theme();
        const isInitialized = store.isInitialized();
        const connectedAddress = store.connectedAccount();

        // Save to storage (runs on every state change)
        store.saveToStorage();
      });
    },

    onDestroy() {
      console.log('App State Store destroyed');
    },
  })
);
