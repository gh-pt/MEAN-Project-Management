import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private toastr: ToastrService) { }

  canActivate(): Observable<boolean> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem('isLogin') === 'true') {
      return true;
    } else {
      this.toastr.error('Please Login First');
      this.router.navigate(['/login']);
      return false;
    }
  }
}