import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { AuthService } from './auth.service';
import { ItemCarrinho } from '../models/itemcarrinho.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  private baseUrl = `${environment.apiUrl}/vendas`;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {  }

  finalizarCompra(idEnderecoEntrega:number, itensVenda: ItemCarrinho[]): Observable<any> {

    const params = {
      idEnderecoEntrega: idEnderecoEntrega,
      itensVenda: itensVenda
    }

    return this.httpClient.post<any>(`${this.baseUrl}`, params);
  }

  minhasCompras(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/minhascompras`);
  }
}
