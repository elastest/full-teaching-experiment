import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private cookieService: CookieService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!environment.production) {
      req = req.clone({
        url: environment.API_URL + req.url
      });
    }

    return next.handle(req).do(event => {
      if(event instanceof HttpResponse){
        console.log(event.headers)
      }
    });
  }
}
