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
export class QuestionService {
  private API_URL = `${environment.apiUrl}/questions`;
  constructor(private readonly http: HttpClient) { }
  getAll() {
    const url = `${this.API_URL}`;
    return this.http.get<any>(url);
  }
  getBySurveyId(surveyId: number): Observable<any> {
    const url = `${this.API_URL}/survey/${surveyId}`;
    return this.http.get<any>(url);
  }
  getAllQuestionTypes(): Observable<any> {
    const url = `${this.API_URL}/questionTypes`;
    return this.http.get<any>(url);
  }
  add(question: any): Observable<any> {
    const url = `${this.API_URL}`;
    var body = JSON.stringify(question);
    return this.http.post<any>(url, body, httpOptions);
  }
  getById(id: any): Observable<any> {
    const url = `${this.API_URL}/${id}`;
    return this.http.get<any>(url);
  }
  update(id: any, question: any): Observable<any> {
    const url = `${this.API_URL}/${id}`;
    var body = JSON.stringify(question);
    return this.http.put<any>(url, body, httpOptions);
  }
  delete(id: any): Observable<any> {
    const url = `${this.API_URL}/${id}`;
    return this.http.delete<any>(url);
  }
}
