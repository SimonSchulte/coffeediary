import {Injectable} from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {
  Espresso,
  EspressoPull,
  EspressoRecipe,
  NewEspressoInput,
  NewEspressoPullInput,
} from '../models/espresso';

@Injectable({providedIn: 'root'})
export class SupabaseEspressosService {
  private supabase: SupabaseClient;
  private table = 'espressos';

  constructor() {
    const url = 'https://ntcysllbkxfigcceaacy.supabase.co'; // TODO: Ersetzen oder aus Konfiguration laden
    const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50Y3lzbGxia3hmaWdjY2VhYWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNTA0OTIsImV4cCI6MjA3ODcyNjQ5Mn0.QUyRWK5JjZLoPtg0XbzJfHQnIrfR3ZXPm-VPvt7MsZI'; // TODO: Ersetzen oder aus Konfiguration laden
    this.supabase = createClient(url, key);
  }

  async getAll(): Promise<Espresso[]> {
    // Hole alle aktiven (nicht archivierten) Espressi inkl. aller zugehörigen espresso_pull Einträge
    const {data, error} = await this.supabase
      .from(this.table)
      .select('*, espresso_pulls(*)')
      .eq('archived', false)
      .order('id', {ascending: true});
    if (error) throw error;
    return (data ?? []) as Espresso[];
  }

  async getArchived(): Promise<Espresso[]> {
    const {data, error} = await this.supabase
      .from(this.table)
      .select('*, espresso_pulls(*)')
      .eq('archived', true)
      .order('id', {ascending: true});
    if (error) throw error;
    return (data ?? []) as Espresso[];
  }

  async setArchived(id: number, archived: boolean): Promise<void> {
    const {error} = await this.supabase.from(this.table).update({archived}).eq('id', id);
    if (error) throw error;
  }

  async getById(id: number): Promise<Espresso> {
    const {data, error} = await this.supabase.from(this.table).select('*').eq('id', id).single();
    if (error) throw error;
    return data as Espresso;
  }

  async create(espresso: NewEspressoInput): Promise<Espresso[]> {
    const {data, error} = await this.supabase.from(this.table).insert([espresso]).select();
    if (error) throw error;
    return (data ?? []) as Espresso[];
  }

  async createEspressoPull(espressoPull: NewEspressoPullInput): Promise<EspressoPull[]> {
    const {data, error} = await this.supabase
      .from('espresso_pulls')
      .insert([espressoPull])
      .select();
    if (error) throw error;
    return (data ?? []) as EspressoPull[];
  }

  async update(id: number, espresso: Partial<NewEspressoInput>): Promise<Espresso[]> {
    const {data, error} = await this.supabase
      .from(this.table)
      .update(espresso)
      .eq('id', id)
      .select();
    if (error) throw error;
    return (data ?? []) as Espresso[];
  }

  async delete(id: number): Promise<Espresso[]> {
    const {data, error} = await this.supabase.from(this.table).delete().eq('id', id).select();
    if (error) throw error;
    return (data ?? []) as Espresso[];
  }

  async getAllExtractions(espresso_id: number): Promise<EspressoPull[]> {
    const {data, error} = await this.supabase
      .from('espresso_pulls')
      .select('*')
      .eq('espresso_id', espresso_id)
      .order('created_at', {ascending: false});
    if (error) {
      console.error('Fehler beim Laden der Bezüge:', error);
      return [];
    }
    return (data ?? []) as EspressoPull[];
  }

  async updateDefaultRecipe(id: number, recipe: EspressoRecipe): Promise<void> {
    const {error} = await this.supabase.from('espressos').update(recipe).eq('id', id);
    if (error) throw error;
  }
}
