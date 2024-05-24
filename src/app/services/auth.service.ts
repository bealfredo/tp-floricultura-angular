import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LocalStorageService, keyLocalStorage } from './local-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Admin } from '../models/admin.model';
import { Cliente } from '../models/cliente.model';
import { Entregador } from '../models/entregador.model';

export type UsuarioLogado = Admin | Cliente | Entregador;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseURL: string = 'http://localhost:8080/auth';
  private tokenKey : keyLocalStorage = 'jwt_token';
  private usuarioLogadoKey : keyLocalStorage = 'usuario_logado';
  private usuarioLogadoSubject = new BehaviorSubject<UsuarioLogado | null>(null);

  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService,
              private jwtHelper: JwtHelperService) {

    this.initUsuarioLogado();

  }

  private initUsuarioLogado() {
    const usuario = localStorage.getItem(this.usuarioLogadoKey);
    if (usuario) {
      const usuarioLogado = JSON.parse(usuario);

      this.setUsuarioLogado(usuarioLogado);
      this.usuarioLogadoSubject.next(usuarioLogado);
    }
  }


  login(email: string, senha: string, idTipoPerfil: number): Observable<any> {
    const params = {
      login: email,
      senha: senha,
      idTipoPerfil: idTipoPerfil
    }

    //{ observe: 'response' } para garantir que a resposta completa seja retornada (incluindo o cabeçalho)
    return this.http.post(`${this.baseURL}`, params, {observe: 'response'}).pipe(
      tap((res: any) => {
        const authToken = res.headers.get('Authorization') ?? '';
        if (authToken) {
          this.setToken(authToken);
          const usuarioLogado = res.body;
          if (usuarioLogado) {
            this.setUsuarioLogado(usuarioLogado);
            this.usuarioLogadoSubject.next(usuarioLogado);
          }
        }
      })
    );
  }

  setUsuarioLogado(usuario: UsuarioLogado): void {
    this.localStorageService.setItem(this.usuarioLogadoKey, usuario);
  }

  setToken(token: string): void {
    this.localStorageService.setItem(this.tokenKey, token);
  }

  getUsuarioLogado() {
    return this.usuarioLogadoSubject.asObservable();
  }

  getToken(): string | null {
    return this.localStorageService.getItem(this.tokenKey);
  }

  removeToken(): void {
    this.localStorageService.removeItem(this.tokenKey);
  }

  removeUsuarioLogado(): void {
    this.localStorageService.removeItem(this.usuarioLogadoKey);
    this.usuarioLogadoSubject.next(null);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    // Verifica se o token é nulo ou está expirado
    return !token || this.jwtHelper.isTokenExpired(token);
    // npm install @auth0/angular-jwt
  }

}
