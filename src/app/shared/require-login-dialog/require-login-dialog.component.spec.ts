import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequireLoginDialogComponent } from './require-login-dialog.component';

describe('RequireLoginDialogComponent', () => {
  let component: RequireLoginDialogComponent;
  let fixture: ComponentFixture<RequireLoginDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequireLoginDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequireLoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
