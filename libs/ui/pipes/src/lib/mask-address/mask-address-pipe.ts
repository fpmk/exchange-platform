import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskAddress',
})
export class MaskAddressPipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) {
      return '';
    }
    return value
      .substring(0, 6)
      .concat('...')
      .concat(value.substring(value.length - 4));
  }
}
