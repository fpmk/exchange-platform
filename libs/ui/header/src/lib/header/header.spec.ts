import { ComponentFixture } from '@angular/core/testing';
import { Header } from './header';
import { MockBuilder, MockRender } from 'ng-mocks';
import { AppStore, ExchangeWebSocketStore } from '@exchange-platform/state';
import { createMockAppStore } from '@exchange-platform/test-mocks';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await MockBuilder(Header)
      .provide({
        provide: AppStore,
        useValue: createMockAppStore(),
      })
      .provide(ExchangeWebSocketStore);

    fixture = MockRender(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
