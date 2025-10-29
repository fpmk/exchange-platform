import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { SymbolSelector } from './symbol-selector';
import { AppStore } from '@exchange-platform/state';
import { StoragePort } from '@exchange-platform/ports';

describe('SymbolSelector', () => {
  let component: SymbolSelector;
  let fixture: ComponentFixture<SymbolSelector>;
  let mockAppStore: any;
  let mockStorage: any;

  beforeEach(async () => {
    mockAppStore = {
      selectSymbol: jest.fn(),
      selectedSymbol: signal('BTCUSDT'),
      theme: signal('dark'),
      isInitialized: signal(true),
    };

    mockStorage = {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
      has: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SymbolSelector],
      providers: [
        { provide: AppStore, useValue: mockAppStore },
        { provide: StoragePort, useValue: mockStorage },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SymbolSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call selectSymbol when onSymbolChange is triggered', () => {
    const mockEvent = {
      target: { value: 'ETHUSDT' },
    } as unknown as Event;

    component.onSymbolChange(mockEvent);

    expect(mockAppStore.selectSymbol).toHaveBeenCalledWith('ETHUSDT');
  });
});
