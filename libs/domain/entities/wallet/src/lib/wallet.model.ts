import { EIP1193Provider, WalletType } from '@exchange-platform/types';
import { WalletAccount } from './wallet-account.model';

export class Wallet {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly icon: string,
    public readonly type: WalletType,
    public readonly provider: EIP1193Provider,
    private _isConnected: boolean,
    private _account: WalletAccount | null
  ) {}

  setConnected(connected: boolean) {
    this._isConnected = connected;
  }

  setAccount(account: WalletAccount | null) {
    this._account = account;
  }

  get account(): WalletAccount | null {
    return this._account;
  }

  get isConnected(): boolean {
    return this._isConnected;
  }
}
