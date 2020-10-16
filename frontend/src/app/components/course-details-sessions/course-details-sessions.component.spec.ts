import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDetailsSessionsComponent } from './course-details-sessions.component';

describe('CourseDetailsSessionsComponent', () => {
  let component: CourseDetailsSessionsComponent;
  let fixture: ComponentFixture<CourseDetailsSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseDetailsSessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseDetailsSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
