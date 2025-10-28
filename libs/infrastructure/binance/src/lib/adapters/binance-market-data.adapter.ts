import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { MarketDataPort, WebSocketPort } from '@exchange-platform/ports';
import { Candle, CandleInterval, OrderBook, Symbol } from '@exchange-platform/market';
import { BinanceRest24hrTicker, BinanceRestDepth, BinanceRestKline } from '../types/binance-rest.types';
import { BinanceWsDepthLimitMessage, BinanceWsKlineMessage, BinanceWsTickerMessage } from '../types/binance-ws.types';
import { CandleMapper } from '../mappers/candle.mapper';
import { OrderBookMapper } from '../mappers/orderbook.mapper';
import { SymbolMapper } from '../mappers/symbol.mapper';
import { BINANCE_ENVIRONMENTS, DEFAULT_BINANCE_CONFIG } from '../config/binance.config';

/**
 * Binance implementation of MarketDataPort
 * Handles both REST API and WebSocket streams
 */
@Injectable()
export class BinanceMarketDataAdapter implements MarketDataPort {
  private http = inject(HttpClient);
  private ws = inject(WebSocketPort);

  private readonly config = DEFAULT_BINANCE_CONFIG;
  private readonly env = BINANCE_ENVIRONMENTS[this.config.environment];
  private readonly apiUrl = this.env.apiBaseUrl + '/api/v3';

  // ============================================
  // REST API Methods
  // ============================================

  /**
   * Get historical candles (klines)
   */
  getCandles(
    symbol: string,
    interval: CandleInterval,
    limit = 500,
    startTime?: number,
    endTime?: number
  ): Observable<Candle[]> {
    const url = `${this.apiUrl}/klines`;

    let params = new HttpParams()
      .set('symbol', symbol.toUpperCase())
      .set('interval', interval)
      .set('limit', limit.toString());

    if (startTime) {
      params = params.set('startTime', startTime.toString());
    }
    if (endTime) {
      params = params.set('endTime', endTime.toString());
    }

    return this.http.get<BinanceRestKline[]>(url, { params }).pipe(
      map((klines) => CandleMapper.fromRestKlineArray(klines)),
      catchError((error) => {
        console.error('Failed to fetch candles:', error);
        return throwError(
          () => new Error(`Failed to fetch candles: ${error.message}`)
        );
      })
    );
  }

  /**
   * Get order book snapshot
   */
  getOrderBook(symbol: string, limit = 100): Observable<OrderBook> {
    const url = `${this.apiUrl}/depth`;

    const params = new HttpParams()
      .set('symbol', symbol.toUpperCase())
      .set('limit', this.validateDepthLimit(limit).toString());

    return this.http.get<BinanceRestDepth>(url, { params }).pipe(
      map((depth) => OrderBookMapper.fromRestDepth(depth, symbol)),
      catchError((error) => {
        console.error('Failed to fetch order book:', error);
        return throwError(
          () => new Error(`Failed to fetch order book: ${error.message}`)
        );
      })
    );
  }

  /**
   * Get all symbols with 24hr statistics
   */
  getSymbols(): Observable<Symbol[]> {
    const url = `${this.apiUrl}/ticker/24hr`;

    return this.http.get<BinanceRest24hrTicker[]>(url).pipe(
      map(
        (tickers) =>
          tickers
            .filter((t) => t.symbol.endsWith('USDT')) // Filter USDT pairs
            .map((t) => SymbolMapper.fromRest24hrTicker(t))
            .sort((a, b) => b.volume - a.volume) // Sort by volume
      ),
      catchError((error) => {
        console.error('Failed to fetch symbols:', error);
        return throwError(
          () => new Error(`Failed to fetch symbols: ${error.message}`)
        );
      })
    );
  }

  /**
   * Get single symbol statistics
   */
  getSymbol(symbol: string): Observable<Symbol> {
    const url = `${this.apiUrl}/ticker/24hr`;

    const params = new HttpParams().set('symbol', symbol.toUpperCase());

    return this.http.get<BinanceRest24hrTicker>(url, { params }).pipe(
      map((ticker) => SymbolMapper.fromRest24hrTicker(ticker)),
      catchError((error) => {
        console.error('Failed to fetch symbol:', error);
        return throwError(
          () => new Error(`Failed to fetch symbol: ${error.message}`)
        );
      })
    );
  }

  // ============================================
  // WebSocket Streams
  // ============================================

  /**
   * Subscribe to real-time candle updates
   * Stream: <symbol>@kline_<interval>
   */
  subscribeToCandleUpdates(
    symbol: string,
    interval: CandleInterval
  ): Observable<Candle> {
    const stream = `${symbol.toLowerCase()}@kline_${interval}`;

    return this.ws.subscribe<BinanceWsKlineMessage>(stream).pipe(
      map((message) => CandleMapper.fromWsKline(message.k)),
      catchError((error) => {
        const errorMessage =
          error?.message ||
          error?.toString() ||
          'Failed to subscribe to candle updates';
        console.error('Candle stream error:', errorMessage, error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Subscribe to real-time order book updates
   * Stream: <symbol>@depth@100ms or @depth (1000ms)
   */
  subscribeToOrderBookUpdates(
    symbol: string,
    updateSpeed: '100ms' | '1000ms' = '100ms'
  ): Observable<OrderBook> {
    const speedSuffix = updateSpeed === '100ms' ? '@100ms' : '';
    const stream = `${symbol.toLowerCase()}@depth10${speedSuffix}`;

    return this.ws.subscribe<BinanceWsDepthLimitMessage>(stream).pipe(
      map((message) => OrderBookMapper.fromWsLevelDepth(message)),
      catchError((error) => {
        const errorMessage =
          error?.message ||
          error?.toString() ||
          'Failed to subscribe to order book updates';
        console.error('Order book stream error:', errorMessage, error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Subscribe to 24hr ticker updates for a symbol
   * Stream: <symbol>@ticker
   */
  subscribeToTickerUpdates(symbol: string): Observable<Symbol> {
    const stream = `${symbol.toLowerCase()}@ticker`;

    return this.ws.subscribe<BinanceWsTickerMessage>(stream).pipe(
      map((message) => SymbolMapper.fromWsTicker(message)),
      catchError((error) => {
        const errorMessage =
          error?.message ||
          error?.toString() ||
          'Failed to subscribe to ticker updates';
        console.error('Ticker stream error:', errorMessage, error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Subscribe to all market tickers (for market watch)
   * Stream: !ticker@arr
   */
  subscribeToAllTickersUpdates(): Observable<Symbol[]> {
    const stream = '!ticker@arr';

    return this.ws.subscribe<BinanceWsTickerMessage[]>(stream).pipe(
      map((messages) =>
        messages
          .filter((m) => m.s.endsWith('USDT'))
          .map((m) => SymbolMapper.fromWsTicker(m))
      ),
      catchError((error) => {
        const errorMessage =
          error?.message ||
          error?.toString() ||
          'Failed to subscribe to all tickers updates';
        console.error('All tickers stream error:', errorMessage, error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // ============================================
  // Helpers
  // ============================================

  /**
   * Binance only supports specific depth limits
   */
  private validateDepthLimit(limit: number): number {
    const validLimits = [5, 10, 20, 50, 100, 500, 1000, 5000];
    return validLimits.find((l) => l >= limit) || 100;
  }
}
