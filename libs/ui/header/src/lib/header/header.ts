import { Component, inject } from '@angular/core';
import { AppStore, ExchangeWebSocketStore } from '@exchange-platform/state';
import { WalletConnectButton } from '@exchange-platform/wallet-connect-button';

@Component({
  selector: 'lib-header',
  imports: [WalletConnectButton],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly appState = inject(AppStore);
  protected readonly wsStore = inject(ExchangeWebSocketStore);

  protected toggleTheme() {
    const newTheme = this.appState.theme() === 'dark' ? 'light' : 'dark';
    this.appState.setTheme(newTheme);
  }
}
