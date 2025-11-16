import {Injectable} from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';

@Injectable({providedIn: 'root'})
export class SupabaseEspressosService {
  private supabase: SupabaseClient;
  private table = 'espressos';

  constructor() {
    const url = 'https://ntcysllbkxfigcceaacy.supabase.co'; // TODO: Ersetzen oder aus Konfiguration laden
    const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50Y3lzbGxia3hmaWdjY2VhYWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNTA0OTIsImV4cCI6MjA3ODcyNjQ5Mn0.QUyRWK5JjZLoPtg0XbzJfHQnIrfR3ZXPm-VPvt7MsZI'; // TODO: Ersetzen oder aus Konfiguration laden
    this.supabase = createClient(url, key);
  }

  async getAll() {
    // Hole alle Espressos inkl. aller zugehörigen espresso_pull Einträge
    const {data, error} = await this.supabase
      .from(this.table)
      .select('*, espresso_pulls(*)')
      .order('id', {ascending: true});;
    if (error) throw error;
    return data;
  }

  async getById(id: number) {
    const {data, error} = await this.supabase.from(this.table).select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async create(espresso: any) {
    const {data, error} = await this.supabase.from(this.table).insert([espresso]).select();
    if (error) throw error;
    return data;
  }
  async createEspressoPull(espressoPull: any) {
    const {data, error} = await this.supabase.from("espresso_pulls").insert([espressoPull]);
    if (error) throw error;
    return data;
  }

  async update(id: number, espresso: any) {
    const {data, error} = await this.supabase
      .from(this.table)
      .update(espresso)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data;
  }

  async delete(id: number) {
    const {data, error} = await this.supabase.from(this.table).delete().eq('id', id).select();
    if (error) throw error;
    return data;
  }

  async getAllExtractions(espresso_id: number): Promise<any[]> {
    // Beispiel: Holt alle Bezüge aus Supabase
    // Passe dies ggf. an deine Datenstruktur an
    const {data, error} = await this.supabase
      .from('espresso_pulls')
      .select('*')
      .eq('espresso_id', espresso_id)
      .order('created_at', {ascending: false});
    if (error) {
      console.error('Fehler beim Laden der Bezüge:', error);
      return [];
    }
    return data || [];
  }

  async updateDefaultReceipt(
    id: number,
    receip: { gramms: number; ratio: number; grinder_setting: number; runtime: number }
  ): Promise<any> {
    const {data, error} = await this.supabase
      .from('espressos')
      .update(receip)
      .eq('id', id);
    if (error) throw error;
    return data;
  }
}
