// Kline (Candlestick) WebSocket message
export interface BinanceWsKlineMessage {
  e: 'kline';           // Event type
  E: number;            // Event time
  s: string;            // Symbol
  k: BinanceKline;
}

export interface BinanceKline {
  t: number;    // Kline start time
  T: number;    // Kline close time
  s: string;    // Symbol
  i: string;    // Interval
  f: number;    // First trade ID
  L: number;    // Last trade ID
  o: string;    // Open price
  c: string;    // Close price
  h: string;    // High price
  l: string;    // Low price
  v: string;    // Base asset volume
  n: number;    // Number of trades
  x: boolean;   // Is this kline closed?
  q: string;    // Quote asset volume
  V: string;    // Taker buy base asset volume
  Q: string;    // Taker buy quote asset volume
  B: string;    // Ignore
}

// Order Book (Depth) WebSocket message
export interface BinanceWsDepthMessage {
  e: 'depthUpdate';     // Event type
  E: number;            // Event time
  s: string;            // Symbol
  U: number;            // First update ID in event
  u: number;            // Final update ID in event
  b: [string, string][]; // Bids [price, quantity]
  a: [string, string][]; // Asks [price, quantity]
}

// 24hr Ticker WebSocket message
export interface BinanceWsTickerMessage {
  e: '24hrTicker';      // Event type
  E: number;            // Event time
  s: string;            // Symbol
  p: string;            // Price change
  P: string;            // Price change percent
  w: string;            // Weighted average price
  x: string;            // First trade(F)-1 price (first trade before the 24hr rolling window)
  c: string;            // Last price
  Q: string;            // Last quantity
  b: string;            // Best bid price
  B: string;            // Best bid quantity
  a: string;            // Best ask price
  A: string;            // Best ask quantity
  o: string;            // Open price
  h: string;            // High price
  l: string;            // Low price
  v: string;            // Total traded base asset volume
  q: string;            // Total traded quote asset volume
  O: number;            // Statistics open time
  C: number;            // Statistics close time
  F: number;            // First trade ID
  L: number;            // Last trade Id
  n: number;            // Total number of trades
}

// Mini Ticker (for market watch)
export interface BinanceWsMiniTickerMessage {
  e: '24hrMiniTicker';  // Event type
  E: number;            // Event time
  s: string;            // Symbol
  c: string;            // Close price
  o: string;            // Open price
  h: string;            // High price
  l: string;            // Low price
  v: string;            // Total traded base asset volume
  q: string;            // Total traded quote asset volume
}
