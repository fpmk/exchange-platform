import { Time } from 'lightweight-charts';

export interface VolumeData {
  time: Time;
  value: number;
  color?: string;
}

export interface LineData {
  time: Time;
  value: number;
}
