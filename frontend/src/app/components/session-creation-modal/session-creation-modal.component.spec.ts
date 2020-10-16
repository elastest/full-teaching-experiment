import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionCreationModalComponent } from './session-creation-modal.component';

describe('SessionCreationModalComponent', () => {
  let component: SessionCreationModalComponent;
  let fixture: ComponentFixture<SessionCreationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionCreationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionCreationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
