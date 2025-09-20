import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class DebugInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Only log in development mode
    if (!environment.features.enableLogging) {
      return next.handle(request);
    }

    console.group(`🔄 HTTP Request: ${request.method} ${request.url}`);
    console.log('Headers:', request.headers);
    console.log('Body:', request.body);
    console.groupEnd();

    return next.handle(request).pipe(
      tap(
        (event) => {
          if (event instanceof HttpResponse) {
            console.group(`✅ HTTP Response: ${request.method} ${request.url}`);
            console.log('Status:', event.status);
            console.log('Headers:', event.headers);
            console.log('Body:', event.body);
            console.groupEnd();
          }
        },
        (error: HttpErrorResponse) => {
          console.group(`❌ HTTP Error: ${request.method} ${request.url}`);
          console.log('Status:', error.status);
          console.log('Error:', error.message);
          console.log('Response body:', error.error);
          console.groupEnd();
        }
      )
    );
  }
}
