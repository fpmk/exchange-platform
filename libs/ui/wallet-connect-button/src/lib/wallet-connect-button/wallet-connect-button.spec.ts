import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WalletConnectButton } from './wallet-connect-button';

describe('WalletConnectButton', () => {
  let component: WalletConnectButton;
  let fixture: ComponentFixture<WalletConnectButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletConnectButton],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletConnectButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
