export function createMockWalletsStoragePort() {
  return {
    getAvailableWallets: jest.fn(),
    getWalletById: jest.fn(),
    addWallet: jest.fn(),
    removeWallet: jest.fn(),
  };
}
