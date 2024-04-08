import { TestBed } from '@angular/core/testing';

import { ShareIntentService } from './share-intent.service';

describe('ShareIntentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareIntentService = TestBed.get(ShareIntentService);
    expect(service).toBeTruthy();
  });
});
