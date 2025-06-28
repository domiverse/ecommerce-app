import { TestBed } from '@angular/core/testing';

import { VietnameseAddressService } from './vietnamese-address.service';

describe('VietnameseAddressService', () => {
  let service: VietnameseAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VietnameseAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
