import { Wallet, WalletAccount } from '@exchange-platform/wallet';
import { ChainId, WalletAddress, WalletType } from '@exchange-platform/types';
import { ethers } from 'ethers';
import { WalletPort } from '@exchange-platform/ports';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EthereumWalletAdapter implements WalletPort {
  private _eventsInited = false;

  getWalletType(): WalletType {
    return WalletType.EVM;
  }

  async connect(
    wallet: Wallet,
    onAccountChange: (acc: WalletAccount) => void
  ): Promise<Wallet> {
    if (wallet.isConnected) {
      return Promise.resolve(wallet);
    }
    try {
      const accounts: string[] = (await wallet.provider.request({
        method: 'eth_requestAccounts',
      })) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const chainId: string = (await wallet.provider.request({
        method: 'eth_chainId',
      })) as string;
      console.log(`------ Ethereum wallet with id ${chainId}`);
      const provider = new ethers.BrowserProvider(wallet.provider);
      const balance = await provider.getBalance(accounts[0]);
      const account = {
        address: accounts[0] as WalletAddress,
        chainId: chainId as ChainId,
        balance: balance.toString(),
      };
      wallet.isConnected = true;
      wallet.account = account;
      if (!this._eventsInited) {
        wallet.provider.on('accountsChanged', (accounts: string[]) => {
          console.log(`${wallet.name}: Accounts changed`, accounts);
          const account = {
            address: accounts[0] as WalletAddress,
            chainId: chainId as ChainId,
            balance: balance.toString(),
          };
          wallet.account = account;
          onAccountChange(account);
        });
        this._eventsInited = true;
      }
      return Promise.resolve(wallet);
    } catch (error) {
      throw new Error(
        `Failed to connect to ${wallet.name}: ${(error as Error).message}`
      );
    }
  }

  async disconnect(wallet: Wallet): Promise<void> {
    try {
      if (wallet.provider.disconnect) {
        await wallet.provider.disconnect();
      }

      wallet.isConnected = false;
      wallet.account = null;
    } catch (error) {
      throw new Error(
        `Failed to disconnect from ${wallet.name}: ${(error as Error).message}`
      );
    }
  }

  signMessage(wallet: Wallet, message: string): Promise<string> {
    // TODO
    return Promise.resolve('');
  }

  // async signMessage(message: string): Promise<SignedMessage> {
  //   if (!this.isConnected || !this.account) {
  //     throw new Error('Wallet not connected');
  //   }
  //
  //   try {
  //     const signature = await this.provider.request({
  //       method: 'personal_sign',
  //       params: [message, this.account.address],
  //     });
  //
  //     return {
  //       signature,
  //       message,
  //       address: this.account.address,
  //     };
  //   } catch (error) {
  //     throw new Error(`Failed to sign message: ${error.message}`);
  //   }
  // }
  //
  // async sendTransaction(transaction: Transaction): Promise<string> {
  //   if (!this.isConnected || !this.account) {
  //     throw new Error('Wallet not connected');
  //   }
  //
  //   try {
  //     const txHash = await this.provider.request({
  //       method: 'eth_sendTransaction',
  //       params: [
  //         {
  //           from: this.account.address,
  //           to: transaction.to,
  //           value: transaction.value,
  //           data: transaction.data,
  //           gas: transaction.gasLimit,
  //           gasPrice: transaction.gasPrice,
  //         },
  //       ],
  //     });
  //
  //     return txHash;
  //   } catch (error) {
  //     throw new Error(`Failed to send transaction: ${error.message}`);
  //   }
  // }

  // async switchChain(chainId: string): Promise<void> {
  //   try {
  //     await this.provider.request({
  //       method: 'wallet_switchEthereumChain',
  //       params: [{ chainId }],
  //     });
  //   } catch (error) {
  //     if (error.code === 4902) {
  //       throw new Error(`Chain ${chainId} not configured in wallet`);
  //     }
  //     throw error;
  //   }
  // }
}
