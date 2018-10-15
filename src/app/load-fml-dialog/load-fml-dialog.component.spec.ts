import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadFmlDialogComponent } from './load-fml-dialog.component';

describe('LoadFmlDialogComponent', () => {
  let component: LoadFmlDialogComponent;
  let fixture: ComponentFixture<LoadFmlDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadFmlDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadFmlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
