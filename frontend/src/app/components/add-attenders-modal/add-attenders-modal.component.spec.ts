import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttendersModalComponent } from './add-attenders-modal.component';

describe('AddAttendersModalComponent', () => {
  let component: AddAttendersModalComponent;
  let fixture: ComponentFixture<AddAttendersModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAttendersModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAttendersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
