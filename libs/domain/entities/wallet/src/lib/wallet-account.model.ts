import { ChainId, PublicKey, WalletAddress } from '@exchange-platform/types';

export class WalletAccount {
  constructor(
    public readonly address: WalletAddress,
    public readonly balance: string,
    public readonly chainId: ChainId,
    public readonly publicKey?: PublicKey
  ) {}
}
