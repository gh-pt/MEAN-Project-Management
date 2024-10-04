import { HttpClient } from '@angular/common/http';
import { Injectable, Query } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  private baseUrl = 'http://localhost:3000/api/query';

  constructor(private http: HttpClient) { }

  // Method to fetch all queries
  getAllQueries(): Observable<Query[]> {
    return this.http.get<Query[]>(`${this.baseUrl}/queries`);
  }

  // Get Query By Id
  getQueryById(id: object | string): Observable<Query> {
    return this.http.get<Query>(`${this.baseUrl}/getQueryById/${id}`);
  }

  // Get all queries by project
  getQueriesByProject(id: object | string): Observable<Query[]> {
    return this.http.get<Query[]>(`${this.baseUrl}/queriesByProject/${id}`);
  }

  // add new query
  addQuery(query: Query): Observable<Query> {
    return this.http.post<Query>(`${this.baseUrl}/add-query`, query);
  }

  // update query
  updateQuery(id: object, query: Query): Observable<Query> {
    return this.http.put<Query>(`${this.baseUrl}/updateQuery/${id}`, query);
  }

  // delete query
  deleteQuery(id: object): Observable<Query> {
    return this.http.delete<Query>(`${this.baseUrl}/deleteQuery/${id}`);
  }

  // Reply to query
  addReplyToQuery(id: object | string, query: Query): Observable<Query> {
    return this.http.post<Query>(`${this.baseUrl}/replyToQuery/${id}`, query);
  }
}
