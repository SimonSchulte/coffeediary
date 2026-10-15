import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  async function render(meResponse: 'user' | 'unauthorized') {
    const fixture = TestBed.createComponent(App);
    await Promise.resolve(); // AuthService fragt /api/me per Microtask an
    const req = http.expectOne('/api/me');
    if (meResponse === 'user') {
      req.flush({ email: 'simon@example.com', name: 'Simon', picture: null });
    } else {
      req.flush({ error: 'Nicht angemeldet' }, { status: 401, statusText: 'Unauthorized' });
    }
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows the login screen without a session', async () => {
    const el = await render('unauthorized');
    expect(el.querySelector('h2')?.textContent).toContain('Login erforderlich');
  });

  it('shows the user name when logged in', async () => {
    const el = await render('user');
    expect(el.querySelector('h2')).toBeNull();
    expect(el.querySelector('.user-name')?.textContent).toContain('Simon');
  });
});
