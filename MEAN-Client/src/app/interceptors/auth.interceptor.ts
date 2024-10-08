import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { UserService } from '../service/user.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log("Request is being processed");
  const user = localStorage.getItem('user')
  let userId = ''
  const userService = inject(UserService);
  const router = inject(Router);

  if (user) {
    userId = JSON.parse(user).user._id
  }
  // Flag to prevent infinite retry loop
  let isRetryAttempted = false;

  return next(req.clone({ withCredentials: true })).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !isRetryAttempted) {
        console.log("Unauthorized error, attempting to refresh access token.");
        isRetryAttempted = true;

        // Call refreshAccessToken if 401 Unauthorized
        return userService.refreshAccessToken().pipe(
          switchMap(() => {
            console.log("Access token refreshed successfully");

            // Retry the original request after refreshing the token
            const clonedRequest = req.clone({
              withCredentials: true
            });

            return next(clonedRequest); // Retry the original request
          }),
          catchError((refreshError) => {
            console.error("Token refresh failed:", refreshError);
            const user = { userId: userId };
            userService.logoutUser(user).subscribe({
              next() {
                localStorage.removeItem('isLogin');
                localStorage.removeItem('user');
                router.navigate(['/login']);
              },
              error() {
                console.log(err)
              }
            });
            return throwError(() => new Error('Unauthorized after token refresh attempt'));
          })
        );
      }

      return throwError(() => err);
    })
  );
};