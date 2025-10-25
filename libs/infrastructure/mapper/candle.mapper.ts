import { Injectable } from '@angular/core';
import { CandleMapperPort } from '@exchange-platform/ports';
import { CandlestickData } from 'lightweight-charts';
import { Candle } from '../../domain/market/src';
import { VolumeData } from '../../ui/chart-lib/src';

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
    // Implementation
  }
}
