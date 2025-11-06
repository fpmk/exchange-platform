import { SymbolStatus } from '@exchange-platform/types';

export class Symbol {
  constructor(
    public symbol: string,
    public baseAsset: string,
    public quoteAsset: string,
    public status: SymbolStatus,
    public price: number,
    public priceChange: number,
    public priceChangePercent: number,
    public volume: number,
    public highPrice?: number,
    public lowPrice?: number
  ) {}
}
