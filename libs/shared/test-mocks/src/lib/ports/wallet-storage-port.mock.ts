import { of } from 'rxjs';

export function createMockWalletStoragePort() {
  return {
    getConnectedWallet: jest.fn().mockReturnValue(of({ id: 'wallet-id' })),
    saveConnectedWallet: jest.fn(),
    clearConnectedWallet: jest.fn(),
  };
}
