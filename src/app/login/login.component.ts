import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { Router } from '@angular/router';
import { AuthServiceMain } from '../services/auth.service';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: any;
  loader: boolean;
  error: boolean;
  errorMsg: any;

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private socialAuthService: AuthService, private httpService: HttpService, private router: Router, private authService: AuthServiceMain) {
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
    this.loader = false;
  }

  public signinWithGoogle() {
    const socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    this.socialAuthService.signIn(socialPlatformProvider).then((userData) => {
      console.log(userData);
      const data =  {
        googleId : userData.id,
        username : userData.name,
        email : userData.email,
        password : '',
        phone : '',
        address : '',
        profileImage : userData.photoUrl,
        dob : '',
      };
      this.httpService.addUserToDB(data).subscribe((res) => {
        console.log(res);
        this.loader = false;
        if (res.success === true) {
          localStorage.setItem('currentUser', JSON.stringify(res.data));
          this.authService.isAuthenticated = true;
          this.authService.authStatus.next(true);
          this.router.navigate(['../dashboard']);
          this.authService.socket.emit('refresh',{});
        } else {
          this.error = true;
          this.errorMsg = res.message;
        }
      });
    });
  }

}
