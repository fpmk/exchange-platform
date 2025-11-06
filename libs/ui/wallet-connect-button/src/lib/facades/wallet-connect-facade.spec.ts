import { TestBed } from '@angular/core/testing';

import { WalletConnectFacade } from './wallet-connect-facade';

describe('WalletConnectFacade', () => {
  let service: WalletConnectFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletConnectFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
