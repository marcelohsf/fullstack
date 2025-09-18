import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginPayload {
  login: string;
  password: string;
}

interface TokenDTO {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth/login'; // ajuste se necessário

  constructor(private http: HttpClient) {}

  login(login: string, password: string): Observable<TokenDTO> {
    return this.http.post<TokenDTO>(this.apiUrl, { login, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
      })
    );
  }

  logout() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
    }
  }

  // Ajuste: só acessa localStorage no browser (SSR safe)
  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }
}