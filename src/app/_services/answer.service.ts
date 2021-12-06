import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class AnswerService {
  private API_URL = `${environment.apiUrl}/answers`;
  constructor(private readonly http: HttpClient) { }
  getAll() {
    const url = `${this.API_URL}`;
    return this.http.get<any>(url);
  }
  getByQuestionId(questionId: number): Observable<any> {
    const url = `${this.API_URL}/question/${questionId}`;
    return this.http.get<any>(url);
  }
  add(answer: any): Observable<any> {
    const url = `${this.API_URL}`;
    var body = JSON.stringify(answer);
    return this.http.post<any>(url, body, httpOptions);
  }
  getById(id: any): Observable<any> {
    const url = `${this.API_URL}/${id}`;
    return this.http.get<any>(url);
  }
  update(id: any, answer: any): Observable<any> {
    const url = `${this.API_URL}/${id}`;
    var body = JSON.stringify(answer);
    return this.http.put<any>(url, body, httpOptions);
  }
  delete(id: any): Observable<any> {
    const url = `${this.API_URL}/${id}`;
    return this.http.delete<any>(url);
  }
}
