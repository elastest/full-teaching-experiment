import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendersListComponent } from './attenders-list.component';

describe('AttendersListComponent', () => {
  let component: AttendersListComponent;
  let fixture: ComponentFixture<AttendersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
