import { WalletConnectFacade } from './wallet-connect.facade';
import { TestBed } from '@angular/core/testing';
import { MockBuilder } from 'ng-mocks';
import { ConnectWalletUseCase, DisconnectWalletUseCase } from '@exchange-platform/wallet-use-cases';
import { ProviderId } from '@exchange-platform/types';
import { Wallet } from '@exchange-platform/wallet';
import { of } from 'rxjs';
import { WalletStoragePort } from '@exchange-platform/ports';
import { WALLET_REPOSITORIES } from '@exchange-platform/platform';

const mockUseCase = {
  execute: jest.fn(),
};

const mockDisconnectUseCase = {
  execute: jest.fn(),
};

describe('WalletConnectFacade', () => {
  let facade: WalletConnectFacade;

  beforeEach(async () => {
    const mockProvider = {
      providerId: 'metamask' as ProviderId,
      connect: jest.fn(),
    };

    const mockStorage = {
      saveConnectedWallet: jest.fn(),
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
        provide: WALLET_REPOSITORIES,
        useValue: mockProvider,
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
    const providerId = 'metamask' as ProviderId;

    mockUseCase.execute.mockReturnValue(of(fakeWallet));

    facade.connect(providerId).subscribe((wallet) => {
      expect(mockUseCase.execute).toHaveBeenCalledWith(providerId);
      expect(wallet).toEqual(fakeWallet);
      done();
    });
  });

  it('should call disconnect()', (done) => {
    const providerId = 'metamask' as ProviderId;

    mockDisconnectUseCase.execute.mockReturnValue(of(undefined));

    facade.disconnect(providerId).subscribe(() => {
      expect(mockDisconnectUseCase.execute).toHaveBeenCalledWith(providerId);
      done();
    });
  });
});
