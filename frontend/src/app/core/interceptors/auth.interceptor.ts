// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(environment.jwtTokenKey);

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'your-custom-value'
      },
    });
  }
  else {
    req = req.clone({
      setHeaders: {
        'ngrok-skip-browser-warning': 'your-custom-value'
      },
    });
  }

  return next(req);
};
