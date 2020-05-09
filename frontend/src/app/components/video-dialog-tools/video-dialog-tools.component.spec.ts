import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoDialogToolsComponent } from './video-dialog-tools.component';

describe('VideoDialogToolsComponent', () => {
  let component: VideoDialogToolsComponent;
  let fixture: ComponentFixture<VideoDialogToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoDialogToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoDialogToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
