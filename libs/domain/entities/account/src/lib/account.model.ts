import { Balance } from '@exchange-platform/account';

export class Account {
  constructor(
    public balances: Balance[],
    public canTrade: boolean,
    public canWithdraw: boolean,
    public canDeposit: boolean,
    public updateTime: number
  ) {}
}
