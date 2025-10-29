import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { ChartWidgetComponent } from './chart';
import { AppStore, ChartStore } from '@exchange-platform/state';
import { MarketDataPort, StoragePort } from '@exchange-platform/ports';
import {
  createMockAppStore,
  createMockChartStore,
  createMockMarketDataPort,
  createMockStoragePort,
} from '@exchange-platform/test-mocks';

// Mock ChartComponent from feature-chart
jest.mock('@exchange-platform/feature-chart', () => ({
  ChartComponent: Component({ template: '<div>Mocked Chart</div>' })(class {}),
}));

jest.mock('@angular/core/rxjs-interop', () => ({
  takeUntilDestroyed: jest.fn(() => (source: any) => source),
}));

describe('ChartWidgetComponent', () => {
  let component: ChartWidgetComponent;
  let fixture: ComponentFixture<ChartWidgetComponent>;
  let mockAppStore: any;
  let mockChartStore: any;
  let mockMarketDataPort: any;
  let storagePort: any;

  beforeEach(async () => {
    mockAppStore = createMockAppStore();
    mockChartStore = {
      ...createMockChartStore(),
      candles: signal([]),
      interval: signal('1h'),
    };
    mockMarketDataPort = createMockMarketDataPort();
    storagePort = createMockStoragePort();

    await TestBed.configureTestingModule({
      imports: [ChartWidgetComponent],
      providers: [
        { provide: AppStore, useValue: mockAppStore },
        { provide: ChartStore, useValue: mockChartStore },
        { provide: MarketDataPort, useValue: mockMarketDataPort },
        { provide: StoragePort, useValue: storagePort },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const chartFacade = component['chartFacade'];
    const spyOn = jest.spyOn(chartFacade, 'changeCandleInterval');
    expect(component).toBeTruthy();
  });
});
