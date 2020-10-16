import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsDropdownComponent } from './notifications-dropdown.component';

describe('NotificationsDropdownComponent', () => {
  let component: NotificationsDropdownComponent;
  let fixture: ComponentFixture<NotificationsDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
