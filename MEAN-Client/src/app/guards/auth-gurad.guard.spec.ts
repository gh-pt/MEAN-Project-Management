import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authGuradGuard } from './auth-gurad.guard';

describe('authGuradGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuradGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
