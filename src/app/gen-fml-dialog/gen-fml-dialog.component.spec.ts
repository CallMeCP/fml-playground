import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenFmlDialogComponent } from './gen-fml-dialog.component';

describe('GenFmlDialogComponent', () => {
  let component: GenFmlDialogComponent;
  let fixture: ComponentFixture<GenFmlDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenFmlDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenFmlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
