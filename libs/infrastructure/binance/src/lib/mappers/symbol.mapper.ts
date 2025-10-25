import { Symbol } from '@exchange-platform/market';
import { BinanceWsTickerMessage } from '../types/binance-ws.types';
import { BinanceRest24hrTicker } from '../types/binance-rest.types';

export class SymbolMapper {
  /**
   * Map REST 24hr Ticker to Symbol
   */
  static fromRest24hrTicker(ticker: BinanceRest24hrTicker): Symbol {
    return {
      symbol: ticker.symbol,
      baseAsset: this.extractBaseAsset(ticker.symbol),
      quoteAsset: this.extractQuoteAsset(ticker.symbol),
      status: 'TRADING',
      price: parseFloat(ticker.lastPrice),
      priceChange: parseFloat(ticker.priceChange),
      priceChangePercent: parseFloat(ticker.priceChangePercent),
      volume: parseFloat(ticker.volume),
      highPrice: parseFloat(ticker.highPrice),
      lowPrice: parseFloat(ticker.lowPrice),
    };
  }

  /**
   * Map WebSocket Ticker to Symbol
   */
  static fromWsTicker(ticker: BinanceWsTickerMessage): Symbol {
    return {
      symbol: ticker.s,
      baseAsset: this.extractBaseAsset(ticker.s),
      quoteAsset: this.extractQuoteAsset(ticker.s),
      status: 'TRADING',
      price: parseFloat(ticker.c),
      priceChange: parseFloat(ticker.p),
      priceChangePercent: parseFloat(ticker.P),
      volume: parseFloat(ticker.v),
      highPrice: parseFloat(ticker.h),
      lowPrice: parseFloat(ticker.l),
    };
  }

  private static extractBaseAsset(symbol: string): string {
    // Simple extraction: BTCUSDT -> BTC
    return symbol.replace(/USDT|BUSD|BTC|ETH|BNB$/, '');
  }

  private static extractQuoteAsset(symbol: string): string {
    if (symbol.endsWith('USDT')) return 'USDT';
    if (symbol.endsWith('BUSD')) return 'BUSD';
    if (symbol.endsWith('BTC')) return 'BTC';
    if (symbol.endsWith('ETH')) return 'ETH';
    if (symbol.endsWith('BNB')) return 'BNB';
    return 'USDT';
  }
}
