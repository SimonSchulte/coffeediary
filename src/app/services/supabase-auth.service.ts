import {Injectable} from '@angular/core';
import {createClient, SupabaseClient, Session, User} from '@supabase/supabase-js';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class SupabaseAuthService {
  private supabase: SupabaseClient;
  private session: Session | null = null;
  private user: User | null = null;

  private userSubject = new BehaviorSubject<User | null>(null);
  private loggedInSubject = new BehaviorSubject<boolean>(false);

  user$: Observable<User | null> = this.userSubject.asObservable();
  loggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  constructor() {
    const url = 'https://ntcysllbkxfigcceaacy.supabase.co';
    const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50Y3lzbGxia3hmaWdjY2VhYWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNTA0OTIsImV4cCI6MjA3ODcyNjQ5Mn0.QUyRWK5JjZLoPtg0XbzJfHQnIrfR3ZXPm-VPvt7MsZI';
    this.supabase = createClient(url, key);

    this.supabase.auth.getSession().then(({data}) => {
      this.session = data.session;
      this.user = data.session?.user ?? null;
      this.userSubject.next(this.user);
      this.loggedInSubject.next(!!this.session);
    });
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.session = session;
      this.user = session?.user ?? null;
      this.userSubject.next(this.user);
      this.loggedInSubject.next(!!this.session);
    });
  }

  getUser() {
    return this.user;
  }

  isLoggedIn() {
    return !!this.session;
  }

  async signInWithGoogle() {
    const {data, error} = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      // options : {
      //   redirectTo: "https://simonschulte.github.io/coffeediary/espressos"
      // }
    });
    if (error) throw error;
  }

  async signOut() {
    await this.supabase.auth.signOut();
    this.session = null;
    this.user = null;
    this.userSubject.next(null);
    this.loggedInSubject.next(false);
  }
}
