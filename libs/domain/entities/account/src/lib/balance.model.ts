export interface Balance {
  asset: string;
  free: number;
  locked: number;
  total: number;
}

export interface AccountInfo {
  balances: Balance[];
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  updateTime: number;
}
