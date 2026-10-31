import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {
  Espresso,
  EspressoPull,
  EspressoRecipe,
  NewEspressoInput,
  NewEspressoPullInput,
} from '../models/espresso';
import {API_BASE_URL} from './api.config';

@Injectable({providedIn: 'root'})
export class EspressosApi {
  private http = inject(HttpClient);
  private url = `${inject(API_BASE_URL)}/espressos`;

  getAll(): Promise<Espresso[]> {
    // Alle aktiven (nicht archivierten) Espressi inkl. ihrer Bezüge
    return firstValueFrom(this.http.get<Espresso[]>(this.url, {params: {archived: 0}}));
  }

  getArchived(): Promise<Espresso[]> {
    return firstValueFrom(this.http.get<Espresso[]>(this.url, {params: {archived: 1}}));
  }

  async setArchived(id: number, archived: boolean): Promise<void> {
    await this.update(id, {archived});
  }

  getById(id: number): Promise<Espresso> {
    return firstValueFrom(this.http.get<Espresso>(`${this.url}/${id}`));
  }

  create(espresso: NewEspressoInput): Promise<Espresso[]> {
    return firstValueFrom(this.http.post<Espresso[]>(this.url, espresso));
  }

  createEspressoPull(espressoPull: NewEspressoPullInput): Promise<EspressoPull[]> {
    return firstValueFrom(
      this.http.post<EspressoPull[]>(`${this.url}/${espressoPull.espresso_id}/pulls`, espressoPull),
    );
  }

  update(id: number, espresso: Partial<NewEspressoInput>): Promise<Espresso[]> {
    return firstValueFrom(this.http.patch<Espresso[]>(`${this.url}/${id}`, espresso));
  }

  delete(id: number): Promise<Espresso[]> {
    return firstValueFrom(this.http.delete<Espresso[]>(`${this.url}/${id}`));
  }

  async getAllExtractions(espresso_id: number): Promise<EspressoPull[]> {
    try {
      return await firstValueFrom(this.http.get<EspressoPull[]>(`${this.url}/${espresso_id}/pulls`));
    } catch (error) {
      console.error('Fehler beim Laden der Bezüge:', error);
      return [];
    }
  }

  async updateDefaultRecipe(id: number, recipe: EspressoRecipe): Promise<void> {
    await this.update(id, recipe);
  }
}
