import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {Handbrew, HandbrewPull, NewHandbrewInput, NewHandbrewPullInput} from '../models/handbrew';
import {API_BASE_URL} from './api.config';

@Injectable({providedIn: 'root'})
export class HandbrewsApi {
  private http = inject(HttpClient);
  private url = `${inject(API_BASE_URL)}/handbrews`;

  getAll(): Promise<Handbrew[]> {
    return firstValueFrom(this.http.get<Handbrew[]>(this.url, {params: {archived: 0}}));
  }

  getArchived(): Promise<Handbrew[]> {
    return firstValueFrom(this.http.get<Handbrew[]>(this.url, {params: {archived: 1}}));
  }

  async setArchived(id: number, archived: boolean): Promise<void> {
    await this.update(id, {archived});
  }

  getById(id: number): Promise<Handbrew> {
    return firstValueFrom(this.http.get<Handbrew>(`${this.url}/${id}`));
  }

  create(handbrew: NewHandbrewInput): Promise<Handbrew[]> {
    return firstValueFrom(this.http.post<Handbrew[]>(this.url, handbrew));
  }

  update(id: number, handbrew: Partial<NewHandbrewInput>): Promise<Handbrew[]> {
    return firstValueFrom(this.http.patch<Handbrew[]>(`${this.url}/${id}`, handbrew));
  }

  delete(id: number): Promise<Handbrew[]> {
    return firstValueFrom(this.http.delete<Handbrew[]>(`${this.url}/${id}`));
  }

  createHandbrewPull(pull: NewHandbrewPullInput): Promise<HandbrewPull[]> {
    return firstValueFrom(
      this.http.post<HandbrewPull[]>(`${this.url}/${pull.handbrew_id}/pulls`, pull),
    );
  }

  async getAllPulls(handbrew_id: number): Promise<HandbrewPull[]> {
    try {
      return await firstValueFrom(this.http.get<HandbrewPull[]>(`${this.url}/${handbrew_id}/pulls`));
    } catch (error) {
      console.error('Fehler beim Laden der Aufgüsse:', error);
      return [];
    }
  }
}
