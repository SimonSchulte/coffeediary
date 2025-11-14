import { TestBed } from '@angular/core/testing';

import { SupabaseEspressos } from './supabase.espressos';

describe('SupabaseEspressos', () => {
  let service: SupabaseEspressos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupabaseEspressos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
