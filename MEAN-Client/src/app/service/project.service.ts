import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../CustomClass/project';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:3000/api/project/';

  constructor(private http: HttpClient) { }

  // Get all products
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  // Get a single product by ID
  getProjectById(id: object | string): Observable<Project> {
    const url = `${this.apiUrl + 'getProjectById'}/${id}`;
    return this.http.get<Project>(url);
  }

  getProductByOwner(id: object): Observable<Project[]> {
    const url = `${this.apiUrl + 'getProjectsByOwner'}/${id}`;
    return this.http.get<Project[]>(url);
  }

  // Create a new product
  createProject(projectFromData: Project): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}add`, projectFromData);
  }

  // Update an existing product by ID
  updateProject(prodId: object, formData: FormData): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}updateProject/${prodId}`, formData);
  }

  // Delete a product by ID
  deleteProject(id: object): Observable<Project> {
    const url = `${this.apiUrl + 'deleteProject'}/${id}`;
    return this.http.delete<Project>(url);
  }

  // Search a product by Name
  searchProducts(searchTerm: string): Observable<Project[]> {
    const url = `${this.apiUrl + 'getProjectByName'}/${searchTerm}`;
    return this.http.get<Project[]>(url); 
  }
}
