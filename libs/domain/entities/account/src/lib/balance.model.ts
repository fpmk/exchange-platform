export class Balance {
  constructor(
    public asset: string,
    public free: number,
    public locked: number,
    public total: number
  ) {}
}
