import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartLib } from './chart';

describe('ChartLib', () => {
  let component: ChartLib;
  let fixture: ComponentFixture<ChartLib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartLib],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartLib);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
