import { TestBed } from '@angular/core/testing';

import { WalletButtonConnectFacade } from './wallet-button-connect.facade';
import { MockBuilder } from 'ng-mocks';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { ComponentPortal } from '@angular/cdk/portal';
import { WalletConnect } from '@exchange-platform/wallet-connect';

describe('WalletButtonConnectFacade', () => {
  let service: WalletButtonConnectFacade;
  let overlay: jest.Mocked<Partial<Overlay>>;
  let overlayRef: jest.Mocked<OverlayRef>;
  const backdropClick$ = new Subject<MouseEvent>();

  beforeEach(async () => {
    overlayRef = {
      attach: jest.fn(),
      detach: jest.fn(),
      backdropClick: jest.fn(() => backdropClick$.asObservable()),
      dispose: jest.fn(),
    } as unknown as jest.Mocked<OverlayRef>;
    const overlayMock = {
      create: jest.fn(() => overlayRef),
      position: jest.fn(() => ({
        global: () => ({
          right: jest.fn().mockReturnThis(),
        }),
      })),
      scrollStrategies: {
        block: jest.fn(),
      },
    } as unknown as jest.Mocked<Overlay>;
    await MockBuilder(WalletButtonConnectFacade)
      .provide(WalletButtonConnectFacade)
      .mock(Overlay, overlayMock);
    service = TestBed.inject(WalletButtonConnectFacade);
    overlay = TestBed.inject(Overlay);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create overlay and attach WalletComponent', async () => {
    await service.connectWallet();

    expect(overlay.create).toHaveBeenCalledWith(
      expect.objectContaining({
        hasBackdrop: true,
        disposeOnNavigation: true,
      })
    );

    expect(overlayRef.attach).toHaveBeenCalledWith(expect.any(ComponentPortal));

    const [portalArg] = overlayRef.attach.mock.calls[0];
    expect(portalArg.component).toBe(WalletConnect);
  });

  it('should detach overlay when backdrop is clicked', async () => {
    await service.connectWallet();

    backdropClick$.next(new MouseEvent('click'));

    expect(overlayRef.detach).toHaveBeenCalled();
  });
});
