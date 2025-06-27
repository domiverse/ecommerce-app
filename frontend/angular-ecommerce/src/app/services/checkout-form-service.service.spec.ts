import { TestBed } from '@angular/core/testing';

import { CheckoutFormServiceService } from './checkout-form-service.service';

describe('CheckoutFormServiceService', () => {
  let service: CheckoutFormServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutFormServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
