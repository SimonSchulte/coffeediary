import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class SupabaseEspressosService {
  private supabase: SupabaseClient;
  private table = 'espressos';

  constructor() {
    const url = 'https://ntcysllbkxfigcceaacy.supabase.co'; // TODO: Ersetzen oder aus Konfiguration laden
    const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50Y3lzbGxia3hmaWdjY2VhYWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNTA0OTIsImV4cCI6MjA3ODcyNjQ5Mn0.QUyRWK5JjZLoPtg0XbzJfHQnIrfR3ZXPm-VPvt7MsZI'; // TODO: Ersetzen oder aus Konfiguration laden
    this.supabase = createClient(url, key);
  }

  async getAll() {
    const { data, error } = await this.supabase.from(this.table).select('*');
    if (error) throw error;
    return data;
  }

  async getById(id: number) {
    const { data, error } = await this.supabase.from(this.table).select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async create(espresso: any) {
    const { data, error } = await this.supabase.from(this.table).insert([espresso]).select();
    if (error) throw error;
    return data;
  }

  async update(id: number, espresso: any) {
    const { data, error } = await this.supabase.from(this.table).update(espresso).eq('id', id).select();
    if (error) throw error;
    return data;
  }

  async delete(id: number) {
    const { data, error } = await this.supabase.from(this.table).delete().eq('id', id).select();
    if (error) throw error;
    return data;
  }
}

