import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: any;
  loader: boolean;

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private router: Router, private authService: AuthService) {
    this.loginForm = this.formBuilder.group({
      email : new FormControl('', [Validators.required, Validators.email]),
      password : new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/dashboard']);
    }
    // Change <body> styling
    document.body.classList.add('background');
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    // Change <body> styling
    document.body.classList.remove('background');
  }

  loginUser = async () => {
    this.loader = true;
    if (!this.loginForm.valid) {
      this.loader = false;
      return false;
    }
    const userData = {
      email : this.loginForm.value.email,
      password : this.loginForm.value.password
    };
    await this.authService.userLogin(userData);
    console.log(this.authService.userLogin(userData));
    this.loader = false;
  }

}
