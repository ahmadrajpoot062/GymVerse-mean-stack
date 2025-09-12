import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add auth header with jwt token if available
    const token = this.authService.getToken();
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Add content type if not already set
    if (!request.headers.has('Content-Type') && !(request.body instanceof FormData)) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json'
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Auto logout if 401 response returned from api
          this.authService.logout();
        }
        
        return throwError(() => error);
      })
    );
  }
}
