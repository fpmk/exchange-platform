import { inject, Injectable } from '@angular/core';
import { BrowserProvider, ethers, JsonRpcSigner } from 'ethers';
import { AppStore, WalletAddress } from '@exchange-platform/state';

type EtherWindow = typeof window & { ethereum: any };

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private readonly appState = inject(AppStore);

  private signer!: JsonRpcSigner;
  private provider!: BrowserProvider;

  constructor() {
    const w = window as EtherWindow;
    if (!w.ethereum) {
      console.warn('No MetaMask found');
      this.provider = ethers.getDefaultProvider() as BrowserProvider;
    } else {
      this.provider = new BrowserProvider(w.ethereum) as BrowserProvider;
    }
  }

  async connectWallet() {
    this.signer = await this.provider.getSigner();
    const address = await this.signer.getAddress();
    this.appState.setAddress(address as WalletAddress);
  }
}
