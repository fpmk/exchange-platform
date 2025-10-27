import { Injectable } from '@angular/core';
import { CandleMapperPort } from '@exchange-platform/ports';
import { CandlestickData, VolumeData } from '@exchange-platform/chart-ui';
import { Candle } from '@exchange-platform/market';

@Injectable()
export class CandleMapperAdapter implements CandleMapperPort {
  toChartData(candle: Candle): CandlestickData {
    return {
      time: candle.time as any,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    };
  }

  toVolumeData(candle: Candle): VolumeData {
    const isBullish = candle.close >= candle.open;

    return {
      time: candle.time as any,
      value: candle.volume,
      color: isBullish ? '#26a69a80' : '#ef535080', // Semi-transparent green/red
    };
  }
}
