export interface BinanceEnvironment {
  wsBaseUrl: string;
  apiBaseUrl: string;
  wsStreamUrl: string;
}

export const BINANCE_ENVIRONMENTS = {
  production: {
    wsBaseUrl: 'wss://stream.binance.com:9443',
    apiBaseUrl: 'https://api.binance.com',
    wsStreamUrl: 'wss://stream.binance.com:9443/ws',
  },
  testnet: {
    wsBaseUrl: 'wss://testnet.binance.vision',
    apiBaseUrl: 'https://api.binance.com',
    wsStreamUrl: 'wss://data-stream.binance.vision/ws',
  }
} as const;

export interface BinanceConfig {
  environment: 'production' | 'testnet';
  apiKey?: string;
  apiSecret?: string;
  recvWindow?: number;
}

export const DEFAULT_BINANCE_CONFIG: BinanceConfig = {
  environment: 'testnet',
  recvWindow: 5000,
};
