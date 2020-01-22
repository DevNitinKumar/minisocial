import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceMain } from './auth.service';

@Injectable()
export class Restrict implements CanActivate {
  constructor(private authService: AuthServiceMain, private router: Router) { }

  canActivate() {
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}
