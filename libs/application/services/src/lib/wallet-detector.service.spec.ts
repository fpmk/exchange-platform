// import { TestBed } from '@angular/core/testing';

// import { WalletService, WINDOW } from './wallet.service';
// import { AppStore, WalletAddress } from '@exchange-platform/state';
// import { createMockAppStore } from '@exchange-platform/test-mocks';
// import { BrowserProvider } from 'ethers';
//
// jest.mock('ethers', () => ({
//   BrowserProvider: jest.fn().mockImplementation(() => ({
//     getSigner: jest.fn().mockResolvedValue({
//       getAddress: jest
//         .fn()
//         .mockResolvedValue('0x1234567890123456789012345678901234567890'),
//     }),
//     getNetwork: jest.fn().mockResolvedValue({ chainId: 1 }),
//     send: jest.fn(),
//   })),
// }));
//
// describe('WalletService', () => {
//   let service: WalletService;
//   let mockAppStore: jest.Mocked<ReturnType<typeof createMockAppStore>>;
//   let providerMock: any;
//   let signerMock: any;
//
//   const mockWindow = {
//     ethereum: {
//       request: jest.fn().mockResolvedValue(['0x123']),
//     },
//   } as any;
//
//   beforeEach(() => {
//     mockAppStore = createMockAppStore() as jest.Mocked<
//       ReturnType<typeof createMockAppStore>
//     >;
//     signerMock = { getAddress: jest.fn().mockResolvedValue('0x123') };
//     providerMock = { getSigner: jest.fn().mockResolvedValue(signerMock) };
//     jest
//       .spyOn(BrowserProvider.prototype as any, 'constructor')
//       .mockImplementation(() => providerMock);
//     TestBed.configureTestingModule({
//       providers: [
//         {
//           provide: AppStore,
//           useValue: mockAppStore,
//         },
//         {
//           provide: WINDOW,
//           useValue: mockWindow,
//         },
//       ],
//     });
//     service = TestBed.inject(WalletService);
//   });
//
//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
//
//   it('should connect to wallet and get address', async () => {
//     const expectedAddress = '0x123';
//
//     await service.connectWallet();
//
//     expect(providerMock.getSigner).toHaveBeenCalled();
//     expect(signerMock.getAddress).toHaveBeenCalled();
//     expect(mockAppStore.setAddress).toHaveBeenCalledWith(
//       expectedAddress as WalletAddress
//     );
//   });
// });
