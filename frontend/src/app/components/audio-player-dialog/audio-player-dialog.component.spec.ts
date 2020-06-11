import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioPlayerDialogComponent } from './audio-player-dialog.component';

describe('AudioPlayerDialogComponent', () => {
  let component: AudioPlayerDialogComponent;
  let fixture: ComponentFixture<AudioPlayerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioPlayerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioPlayerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
