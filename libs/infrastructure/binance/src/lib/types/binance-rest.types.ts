// Kline/Candlestick REST response
export type BinanceRestKline = [
  number,   // Open time
  string,   // Open
  string,   // High
  string,   // Low
  string,   // Close
  string,   // Volume
  number,   // Close time
  string,   // Quote asset volume
  number,   // Number of trades
  string,   // Taker buy base asset volume
  string,   // Taker buy quote asset volume
  string    // Ignore
];

// Order Book (Depth) REST response
export interface BinanceRestDepth {
  lastUpdateId: number;
  bids: [string, string][]; // [price, quantity]
  asks: [string, string][]; // [price, quantity]
}

// 24hr Ticker REST response
export interface BinanceRest24hrTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

// Exchange Info
export interface BinanceExchangeInfo {
  timezone: string;
  serverTime: number;
  symbols: BinanceSymbolInfo[];
}

export interface BinanceSymbolInfo {
  symbol: string;
  status: string;
  baseAsset: string;
  quoteAsset: string;
  baseAssetPrecision: number;
  quoteAssetPrecision: number;
  orderTypes: string[];
  icebergAllowed: boolean;
  filters: any[];
}
