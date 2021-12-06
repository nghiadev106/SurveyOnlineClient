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
export class CategoryService {
  private API_URL = `${environment.apiUrl}/categories`;
  constructor(private readonly http: HttpClient) { }
  getAll() {
    const url = `${this.API_URL}`;
    return this.http.get<any>(url);
  }
  getAllPaging(data: any): Observable<any> {
    const url = `${this.API_URL}/paging?pageSize=${data.pageSize}&page=${data.page}&keyword=${data.keyword}`;
    return this.http.get<any>(url);
  }
  addCategory(category: any): Observable<number> {
    const url = `${this.API_URL}`;
    var body = JSON.stringify(category);
    return this.http.post<any>(url, body, httpOptions);
  }
  getCategoryById(id: any): Observable<any> {
    const url = `${this.API_URL}/${id}`;
    return this.http.get<any>(url);
  }
  updateCategory(id: any, category: any): Observable<number> {
    const url = `${this.API_URL}/${id}`;
    var body = JSON.stringify(category);
    return this.http.put<any>(url, body, httpOptions);
  }
  deleteCategory(id: any): Observable<number> {
    const url = `${this.API_URL}/${id}`;
    return this.http.delete<any>(url);
  }
}
