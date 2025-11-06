import { Pipe, PipeTransform } from '@angular/core';
import { WalletAddress } from '@exchange-platform/types';

@Pipe({
  name: 'maskAddress',
})
export class MaskAddressPipe implements PipeTransform {
  transform(value: WalletAddress): string {
    if (!value) {
      return '';
    }
    return value
      .substring(0, 6)
      .concat('...')
      .concat(value.substring(value.length - 4));
  }
}
