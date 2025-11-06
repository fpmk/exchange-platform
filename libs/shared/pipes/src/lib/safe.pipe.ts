import { inject, Pipe, PipeTransform } from '@angular/core';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  private readonly _sanitizer = inject(DomSanitizer);

  transform(value: string, type: 'url' | 'resourceUrl'): SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'url':
        return this._sanitizer.bypassSecurityTrustUrl(value);
      case 'resourceUrl':
        return this._sanitizer.bypassSecurityTrustResourceUrl(value);
      default:
        throw new Error(`Invalid safe type specified: ${type}`);
    }
  }
}
