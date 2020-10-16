import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioRecorderComponent } from './audio-recorder.component';

describe('AudioRecorderComponent', () => {
  let component: AudioRecorderComponent;
  let fixture: ComponentFixture<AudioRecorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioRecorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioRecorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
