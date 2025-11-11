import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WalletConnectButton } from './wallet-connect-button';
import { AppStore } from '@exchange-platform/state';
import {
  createMockAppStore,
  createMockWalletsStoragePort,
  createMockWalletStoragePort,
} from '@exchange-platform/test-mocks';
import { WalletButtonConnectFacade } from '../facades/wallet-button-connect.facade';
import {
  WalletsStoragePort,
  WalletStoragePort,
} from '@exchange-platform/ports';
import { WALLET_ADAPTERS } from '@exchange-platform/wallet-api';
import { of } from 'rxjs';
import { MockService } from 'ng-mocks';
import { RestoreWalletUseCase } from '@exchange-platform/wallet-use-cases';

describe('WalletConnectButton', () => {
  let component: WalletConnectButton;
  let fixture: ComponentFixture<WalletConnectButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletConnectButton],
      providers: [
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
          provide: WalletButtonConnectFacade,
          useValue: MockService(WalletButtonConnectFacade),
        },
        {
          provide: RestoreWalletUseCase,
          useValue: {
            execute: jest.fn().mockReturnValue(of({ id: 'wallet-id' })),
          },
        },
        {
          provide: WALLET_ADAPTERS,
          useValue: [],
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletConnectButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
