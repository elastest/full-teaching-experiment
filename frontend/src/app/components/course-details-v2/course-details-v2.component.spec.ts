import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDetailsV2Component } from './course-details-v2.component';

describe('CourseDetailsV2Component', () => {
  let component: CourseDetailsV2Component;
  let fixture: ComponentFixture<CourseDetailsV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseDetailsV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseDetailsV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
