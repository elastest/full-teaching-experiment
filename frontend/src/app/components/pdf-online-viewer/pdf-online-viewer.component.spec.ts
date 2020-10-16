import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfOnlineViewerComponent } from './pdf-online-viewer.component';

describe('PdfOnlineViewerComponent', () => {
  let component: PdfOnlineViewerComponent;
  let fixture: ComponentFixture<PdfOnlineViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfOnlineViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfOnlineViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
