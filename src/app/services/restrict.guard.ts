import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class Restrict implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}
