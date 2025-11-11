import { MaskAddressPipe } from './mask-address-pipe';
import { WalletAddress } from '@exchange-platform/types';

describe('MaskAddressPipe', () => {
  it('create an instance', () => {
    const pipe = new MaskAddressPipe();
    expect(pipe).toBeTruthy();
  });

  it('should mask address', () => {
    const pipe = new MaskAddressPipe();
    expect(
      pipe.transform('0xa45e1FE036ab21e0f1723B34FA2b7db56A4C2C61' as WalletAddress)
    ).toEqual('0xa45e...2C61');
  });

  it('should return empty string on empty or null address', () => {
    const pipe = new MaskAddressPipe();
    expect(pipe.transform('' as WalletAddress)).toEqual('');
  });
});
