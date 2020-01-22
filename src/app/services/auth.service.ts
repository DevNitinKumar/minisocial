import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpService } from './http.service';
import io from 'socket.io-client';

@Injectable()
export class AuthServiceMain {

  public authStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isAuthenticated = false;
  message: string;
  socket: any;

  constructor(private router: Router, private httpService: HttpService) {
    this.socket = io("https://minisocialmedia.herokuapp.com");
  }

  getToken() {
    return localStorage.getItem('currentUser');
  }

  isLoggedIn = () => {
    return this.getToken() !== null;
  }

  checkUserStatus = () => {
    return this.authStatus.asObservable();
  }

  getIsAuth = () => {
    this.login();
    return this.isAuthenticated;
  }

  login = () => {
    if (localStorage.getItem('currentUser')) {
      this.authStatus.next(true);
      // this.router.navigate(['/dashboard']);
    }
  }

  loginMessage = (msg) => {
    console.log(msg);
    return msg;
  }

  userLogin = (data) => {
    return this.httpService.userLogin(data).subscribe((res) => {
      if (res.success) {
        localStorage.setItem('currentUser', JSON.stringify(res.data));
        this.isAuthenticated = true;
        this.authStatus.next(true);
        this.router.navigate(['../dashboard']);
        this.socket.emit('refresh',{});
        this.message = 'login success';
      } else {
        this.isAuthenticated = false;
        this.authStatus.next(false);
        this.message = 'invalid credentials';
      }
      // this.loginMessage(this.message);
    });
  }

  logout = () => {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
    this.isAuthenticated = false;
    this.authStatus.next(false);
  }

}
