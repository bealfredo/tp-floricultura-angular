import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Telefone } from '../models/telefone.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TelefoneService {
  private baseUrl = `${environment.apiUrl}/telefones`;

  constructor(private httpClient: HttpClient) {  }

  findAll(): Observable<Telefone[]> {
    return this.httpClient.get<Telefone[]>(this.baseUrl);
  }

  findById(id: string): Observable<Telefone> {
    return this.httpClient.get<Telefone>(`${this.baseUrl}/${id}`);
  }

  insert(telefone: Telefone): Observable<Telefone> {
    return this.httpClient.post<Telefone>(this.baseUrl, telefone)
  }

  update(telefone: Telefone): Observable<Telefone> {
    return this.httpClient.put<Telefone>(`${this.baseUrl}/${telefone.id}`, telefone)
  }

  delete(telefone: Telefone): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${telefone.id}`)
  }

}
