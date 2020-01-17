import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import * as _ from 'lodash';

@Injectable()
export class InterceptHeaderHttps implements HttpInterceptor {

    constructor(private injector: Injector) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url = req.url;

        if (_.includes(req.url, 'api/forgot-password/') || _.includes(req.url, 'api/reset-password/')) {
            return next.handle(req.clone());
        }
        // Get the token header
        let authHeader = '';

        if (localStorage.getItem('currentUser')) {
            const data = JSON.parse(localStorage.getItem('currentUser'));
            authHeader = data.token;
        }
        req = req.clone({ headers: req.headers.set('Authorization', `${authHeader}`) });
        return next.handle(req);
    }
}
