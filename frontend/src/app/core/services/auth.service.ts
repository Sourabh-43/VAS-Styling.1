import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private API = 'http://localhost:5000/api';

  private TOKEN_KEY = 'token';
  private USER_KEY = 'user';

  constructor(private http: HttpClient) {}

  /* ==============================
     LOGIN
  ============================== */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API}/auth/login`, { email, password })
      .pipe(
        tap(res => this.saveAuthData(res.token, res.user))
      );
  }

  /* ==============================
     REGISTER (Optional but Recommended)
  ============================== */
  register(name: string, email: string, password: string) {
    return this.http.post(`${this.API}/auth/register`, {
      name,
      email,
      password
    });
  }

  /* ==============================
     SAVE AUTH DATA
  ============================== */
  private saveAuthData(token: string, user: LoginResponse['user']) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /* ==============================
     GETTERS
  ============================== */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): LoginResponse['user'] | null {
    const user = localStorage.getItem(this.USER_KEY);
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  getUserName(): string {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).name : '';
}

  getUserRole(): 'admin' | 'user' | null {
    return this.getUser()?.role || null;
  }

  /* ==============================
     AUTH CHECKS
  ============================== */
isLoggedIn(): boolean {
  return !!localStorage.getItem('token');
}

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  /* ==============================
     LOGOUT
  ============================== */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}