import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { beforeloginGuard } from './beforelogin.guard';

describe('beforeloginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => beforeloginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
