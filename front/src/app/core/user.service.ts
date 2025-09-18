import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface UsuarioDTO {
  id?: number;
  cpf: string;
  nome: string;
  email: string;
  senha: string;
  dataCriacao?: string;
  contasIds?: number[];
  centrosCustoIds?: number[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8080/usuarios'; // ajuste se necessário

  constructor(private http: HttpClient, private auth: AuthService) {}

  register(usuario: UsuarioDTO): Observable<any> {
    const token = this.auth.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.post(this.apiUrl, usuario, { headers, observe: 'response' });
  }

  update(id: number, usuario: UsuarioDTO): Observable<any> {
    const token = this.auth.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.put(`${this.apiUrl}/${id}`, usuario, { headers });
  }

  delete(id: number): Observable<any> {
    const token = this.auth.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}