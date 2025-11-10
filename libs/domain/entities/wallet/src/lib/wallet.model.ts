import { WalletProvider, WalletType } from '@exchange-platform/types';
import { WalletAccount } from './wallet-account.model';

export class Wallet {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly icon: string,
    public readonly type: WalletType,
    public readonly provider: WalletProvider, // TODO type name???
    public isConnected: boolean,
    public account: WalletAccount | null
  ) {}

}
