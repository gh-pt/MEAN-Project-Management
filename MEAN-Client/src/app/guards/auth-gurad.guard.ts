import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private toastr: ToastrService) { }

  canActivate(): boolean {
    if (localStorage.getItem('isLogin') === 'true') {
      return true;
    } else {
      this.toastr.error('Please Login First');
      this.router.navigate(['/login']);
      return false;
    }
  }
}