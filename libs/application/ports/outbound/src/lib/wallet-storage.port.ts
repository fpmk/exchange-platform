import { Observable } from 'rxjs';
import { Wallet } from '@exchange-platform/wallet';

export abstract class WalletStoragePort {
  abstract getConnectedWallet(): Observable<Wallet | null>;

  abstract saveConnectedWallet(wallet: Wallet): Observable<void>;

  abstract clearConnectedWallet(): Observable<void>;
}
