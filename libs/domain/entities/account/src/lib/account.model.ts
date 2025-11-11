import { Balance } from './balance.model';

export class Account {
  constructor(
    public balances: Balance[],
    public canTrade: boolean,
    public canWithdraw: boolean,
    public canDeposit: boolean,
    public updateTime: number
  ) {}
}
