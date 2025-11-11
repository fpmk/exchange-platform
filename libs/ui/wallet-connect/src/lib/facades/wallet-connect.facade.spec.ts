import { WalletConnectFacade } from './wallet-connect.facade';
import { TestBed } from '@angular/core/testing';
import { MockBuilder } from 'ng-mocks';
import {
  ConnectWalletUseCase,
  DisconnectWalletUseCase,
} from '@exchange-platform/wallet-use-cases';
import { Wallet } from '@exchange-platform/wallet';
import { of } from 'rxjs';
import {
  StoragePort,
  WalletsStoragePort,
  WalletStoragePort,
} from '@exchange-platform/ports';
import {
  createMockAppStore,
  createMockStoragePort,
  createMockWalletsStoragePort,
} from '@exchange-platform/test-mocks';
import { AppStore } from '@exchange-platform/state';
import { WALLET_ADAPTERS } from '@exchange-platform/wallet-api';
import { WalletType } from '@exchange-platform/types';

const mockUseCase = {
  execute: jest.fn(),
};

const mockDisconnectUseCase = {
  execute: jest.fn(),
};

describe('WalletConnectFacade', () => {
  let facade: WalletConnectFacade;

  beforeEach(async () => {
    const mockProvider = [
      {
        getWalletType: WalletType.EVM,
        connect: jest.fn().mockReturnValue({}),
        disconnect: jest.fn().mockReturnValue({}),
        signMessage: jest.fn().mockReturnValue({}),
      }
    ];

    const mockStorage = {
      saveConnectedWallet: jest.fn(),
      clearConnectedWallet: jest.fn(),
    };

    await MockBuilder()
      .provide(WalletConnectFacade)
      .provide({
        provide: ConnectWalletUseCase,
        useValue: mockUseCase,
      })
      .provide({
        provide: DisconnectWalletUseCase,
        useValue: mockDisconnectUseCase,
      })
      .provide({
        provide: StoragePort,
        useValue: createMockStoragePort(),
      })
      .provide({
        provide: AppStore,
        useValue: createMockAppStore(),
      })
      .provide({
        provide: WALLET_ADAPTERS,
        useValue: mockProvider,
      })
      .provide({
        provide: WalletsStoragePort,
        useValue: createMockWalletsStoragePort(),
      })
      .provide({
        provide: WalletStoragePort,
        useValue: mockStorage,
      });
    facade = TestBed.inject(WalletConnectFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should call connect() and save wallet', (done) => {
    const fakeWallet = { account: { address: '0x123' } } as Wallet;
    mockUseCase.execute.mockReturnValue(Promise.resolve(fakeWallet));

    facade.connect(fakeWallet).subscribe((wallet) => {
      expect(mockUseCase.execute).toHaveBeenCalledWith(fakeWallet);
      expect(wallet).toEqual(fakeWallet);
      done();
    });
  });

  it('should call disconnect()', (done) => {
    const fakeWallet = { account: { address: '0x123' } } as Wallet;

    mockDisconnectUseCase.execute.mockReturnValue(Promise.resolve(undefined));

    facade.disconnect(fakeWallet).subscribe(() => {
      expect(mockDisconnectUseCase.execute).toHaveBeenCalledWith(fakeWallet);
      done();
    });
  });
});
