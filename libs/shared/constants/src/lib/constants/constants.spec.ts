import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Constants } from './constants';

describe('Constants', () => {
  let component: Constants;
  let fixture: ComponentFixture<Constants>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Constants],
    }).compileComponents();

    fixture = TestBed.createComponent(Constants);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
