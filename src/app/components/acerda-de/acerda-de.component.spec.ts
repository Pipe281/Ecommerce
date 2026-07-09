import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcerdaDeComponent } from './acerda-de.component';

describe('AcerdaDeComponent', () => {
  let component: AcerdaDeComponent;
  let fixture: ComponentFixture<AcerdaDeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcerdaDeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AcerdaDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
