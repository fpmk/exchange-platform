export interface WalletProvider { // like EIP1193
  request: (payload: {
    method: string;
    params?: unknown[] | object;
  }) => Promise<unknown>;
  disconnect: () => Promise<void>;
  on(eventName: string, callback: (...args: any[]) => void): void;
}

export interface WalletProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns?: string;
}

export interface WalletProviderDetail {
  info: WalletProviderInfo;
  provider: WalletProvider;
}

export interface EVMProviderDetected extends WalletProviderDetail {
  accounts: string[];
  request?: WalletProvider['request'];
}

export interface AnnounceWalletProviderEvent extends Event {
  detail: WalletProviderDetail;
}
