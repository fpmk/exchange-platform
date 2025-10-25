import { Observable } from 'rxjs';
import { AccountInfo, Balance } from '@exchange-platform/account';

export abstract class AccountPort {
  abstract getAccountInfo(): Observable<AccountInfo>;

  abstract getBalance(asset: string): Observable<Balance>;

  abstract subscribeToBalanceUpdates(): Observable<Balance[]>;
}
