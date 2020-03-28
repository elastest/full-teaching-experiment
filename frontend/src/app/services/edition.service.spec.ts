import { TestBed } from '@angular/core/testing';

import { EditionService } from './edition.service';

describe('EditionService', () => {
  let service: EditionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
