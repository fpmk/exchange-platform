import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppStore } from '@exchange-platform/state';
import { RegisterWidget } from '@exchange-platform/widget-system';

@RegisterWidget({
  type: 'symbol-selector',
  name: 'Symbol selector',
  description: 'Find and select symbol',
  icon: 'none',
  category: 'market',
  defaultConfig: {
    title: 'SymbolSelector',
    resizable: false,
    closable: false,
  },
})
@Component({
  selector: 'lib-symbol-selector',
  imports: [],
  templateUrl: './symbol-selector.html',
  styleUrl: './symbol-selector.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SymbolSelector {
  protected readonly appState = inject(AppStore);

  protected onSymbolChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.appState.selectSymbol(select.value);
  }
}
