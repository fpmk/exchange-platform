import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WalletConnectButton } from './wallet-connect-button';
import { AppStore } from '@exchange-platform/state';
import { createMockAppStore } from '@exchange-platform/test-mocks';
import { WalletButtonConnectFacade } from '../facades/wallet-button-connect.facade';
import { MockService } from 'ng-mocks';

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
          provide: WalletButtonConnectFacade,
          useValue: MockService(WalletButtonConnectFacade),
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
