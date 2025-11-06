import { Observable } from 'rxjs';
import { Account, Balance } from '@exchange-platform/account';

export abstract class AccountPort {
  abstract getAccount(): Observable<Account>;

  abstract getBalance(asset: string): Observable<Balance>;

  abstract subscribeToBalanceUpdates(): Observable<Balance[]>;
}
