export interface Symbol {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  status: SymbolStatus;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  volume: number;
  highPrice?: number;
  lowPrice?: number;
}

export type SymbolStatus = 'TRADING' | 'BREAK' | 'HALT';
