import { CandlestickData, VolumeData } from '@exchange-platform/chart-lib';
import { Candle } from '@exchange-platform/market';

export abstract class CandleMapperPort {
  abstract toChartData(candle: Candle): CandlestickData;

  abstract toVolumeData(candle: Candle): VolumeData;
}
