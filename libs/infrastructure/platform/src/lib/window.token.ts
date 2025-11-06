import { InjectionToken } from '@angular/core';
import { Eip1193Provider } from 'ethers';

export interface EthereumProvider extends Eip1193Provider {
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  isTrust?: boolean;
  isPhantom?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (...args: Array<any>) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
}

interface PhantomProvider extends Eip1193Provider {
  ethereum?: EthereumProvider;
  isPhantom?: boolean;
}

interface SolanaProvider {
  isPhantom?: boolean;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    phantom?: PhantomProvider;
    solana?: SolanaProvider;
    WalletConnect?: unknown;
  }
}

export const WINDOW = new InjectionToken<Window>('window', {
  providedIn: 'root',
  factory: () => window,
});
