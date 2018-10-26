import { TestBed } from '@angular/core/testing';

import { GrudyService } from './grudy.service';

describe('GrudyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GrudyService = TestBed.get(GrudyService);
    expect(service).toBeTruthy();
  });
});
