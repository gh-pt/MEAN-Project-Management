import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterUser } from '../CustomClass/register-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/user/';

  constructor(private http: HttpClient) { }

  signIn(data: RegisterUser): Observable<RegisterUser> {
    return this.http.post<any>(this.apiUrl + 'login', data, {
      withCredentials: true
    });
  }

  registerUser(formData: FormData): Observable<FormData> {
    return this.http.post<FormData>(this.apiUrl, formData, {
      withCredentials: true
    });
  }

  logoutUser(userId: string): Observable<RegisterUser> {
    return this.http.post<RegisterUser>(this.apiUrl + 'logout', userId, {
      withCredentials: true
    })
  }
}