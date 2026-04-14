import {Injectable} from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {Handbrew, HandbrewPull, NewHandbrewInput, NewHandbrewPullInput} from '../models/handbrew';

@Injectable({providedIn: 'root'})
export class SupabaseHandbrewsService {
  private supabase: SupabaseClient;
  private table = 'handbrews';

  constructor() {
    const url = 'https://ntcysllbkxfigcceaacy.supabase.co'; // TODO: Ersetzen oder aus Konfiguration laden
    const key =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50Y3lzbGxia3hmaWdjY2VhYWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNTA0OTIsImV4cCI6MjA3ODcyNjQ5Mn0.QUyRWK5JjZLoPtg0XbzJfHQnIrfR3ZXPm-VPvt7MsZI'; // TODO: Ersetzen oder aus Konfiguration laden
    this.supabase = createClient(url, key);
  }

  async getAll(): Promise<Handbrew[]> {
    const {data, error} = await this.supabase
      .from(this.table)
      .select('*, handbrew_pulls(*)')
      .eq('archived', false)
      .order('id', {ascending: true});
    if (error) throw error;
    return (data ?? []) as Handbrew[];
  }

  async getArchived(): Promise<Handbrew[]> {
    const {data, error} = await this.supabase
      .from(this.table)
      .select('*, handbrew_pulls(*)')
      .eq('archived', true)
      .order('id', {ascending: true});
    if (error) throw error;
    return (data ?? []) as Handbrew[];
  }

  async setArchived(id: number, archived: boolean): Promise<void> {
    const {error} = await this.supabase.from(this.table).update({archived}).eq('id', id);
    if (error) throw error;
  }

  async getById(id: number): Promise<Handbrew> {
    const {data, error} = await this.supabase.from(this.table).select('*').eq('id', id).single();
    if (error) throw error;
    return data as Handbrew;
  }

  async create(handbrew: NewHandbrewInput): Promise<Handbrew[]> {
    const {data, error} = await this.supabase.from(this.table).insert([handbrew]).select();
    if (error) throw error;
    return (data ?? []) as Handbrew[];
  }

  async update(id: number, handbrew: Partial<NewHandbrewInput>): Promise<Handbrew[]> {
    const {data, error} = await this.supabase
      .from(this.table)
      .update(handbrew)
      .eq('id', id)
      .select();
    if (error) throw error;
    return (data ?? []) as Handbrew[];
  }

  async delete(id: number): Promise<Handbrew[]> {
    const {data, error} = await this.supabase.from(this.table).delete().eq('id', id).select();
    if (error) throw error;
    return (data ?? []) as Handbrew[];
  }

  async createHandbrewPull(pull: NewHandbrewPullInput): Promise<HandbrewPull[]> {
    const {data, error} = await this.supabase.from('handbrew_pulls').insert([pull]).select();
    if (error) throw error;
    return (data ?? []) as HandbrewPull[];
  }

  async getAllPulls(handbrew_id: number): Promise<HandbrewPull[]> {
    const {data, error} = await this.supabase
      .from('handbrew_pulls')
      .select('*')
      .eq('handbrew_id', handbrew_id)
      .order('created_at', {ascending: false});
    if (error) {
      console.error('Fehler beim Laden der Aufgüsse:', error);
      return [];
    }
    return (data ?? []) as HandbrewPull[];
  }
}
