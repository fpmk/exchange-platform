import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WalletConnect } from './wallet-connect';
import { StoragePort, WalletsStoragePort, WalletStoragePort } from '@exchange-platform/ports';
import {
  createMockAppStore,
  createMockStoragePort,
  createMockWalletsStoragePort, createMockWalletStoragePort
} from '@exchange-platform/test-mocks';
import { AppStore } from '@exchange-platform/state';
import { WalletConnectFacade } from '../facades/wallet-connect.facade';
import { WALLET_ADAPTERS } from '@exchange-platform/wallet-api';

describe('WalletConnect', () => {
  let component: WalletConnect;
  let fixture: ComponentFixture<WalletConnect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletConnect],
      providers: [
        {
          provide: WalletConnectFacade,
          useValue: {
            recoverLastConnection: jest.fn(),
            availableWallets: jest.fn(),
            connect: jest.fn(),
            disconnect: jest.fn(),
          },
        },
        {
          provide: StoragePort,
          useValue: createMockStoragePort(),
        },
        {
          provide: AppStore,
          useValue: createMockAppStore(),
        },
        {
          provide: WalletStoragePort,
          useValue: createMockWalletStoragePort(),
        },
        {
          provide: WalletsStoragePort,
          useValue: createMockWalletsStoragePort(),
        },
        {
          provide: WALLET_ADAPTERS,
          useValue: [],
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletConnect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
