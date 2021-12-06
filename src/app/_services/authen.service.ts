import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { first, map } from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private API_URL = environment.apiUrl;
  private userLogin = new BehaviorSubject({});
  public user$ = this.userLogin.asObservable();
  constructor(private readonly http: HttpClient) { }
  public get userValue(): any {
    return this.userLogin.value;
  }
  login(login: any): Observable<any> {
    const url = `${this.API_URL}/users/authenticate`;
    var log = JSON.stringify(login);
    return this.http.post<any>(url, log, httpOptions).pipe(
      map((user) => {
        if (user !== null) {
          localStorage.removeItem('user');
          localStorage.setItem('user', JSON.stringify(user));
          this.userLogin.next(user);
          return user;
        } else {
          return null;
        }
      })
    );
  }
  register(user: any): Observable<number> {
    const url = `${this.API_URL}/users/register`;
    var userString = JSON.stringify(user);
    return this.http.post<any>(url, userString, httpOptions);
  }
  logout() {
    localStorage.removeItem('user');
    this.userLogin.next(null);
  }
}
