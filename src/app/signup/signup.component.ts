import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, MinLengthValidator, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { HttpService } from '../services/http.service';
import { Router } from '@angular/router';
import { AuthServiceMain } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  maxDate = new Date();
  signupForm: FormGroup;
  // tslint:disable-next-line: ban-types
  disabled: Boolean = false;
  // tslint:disable-next-line: ban-types
  pwdNotMatched: Boolean = false;
  dobDate: any;
  showImage: string;
  isBackgroundRed: any;
  // tslint:disable-next-line: ban-types
  loader: Boolean = false;
  userImagePath: any;
  errorMsg: string;
  error = false;
  loadOTP: boolean;
  otpByUser: any;
  otpRequestId: any;
  verifyScreen: Boolean = false;
  userData: { username: any; email: any; password: any; phone: any; address: any; profileImage: any; dob: any; };
  seconds = 60;
  timer;
  verifyBtnDisable: boolean;
  downloadTimer: any;
  disableSbt:boolean = true;
  fd: FormData;
  captchaSiteKey: any;

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private router: Router, private authService: AuthServiceMain) {
    this.signupForm = this.formBuilder.group({
      username : new FormControl('', [Validators.required]),
      email : new FormControl('', [Validators.required, Validators.email]),
      password : new FormControl('', [Validators.required, Validators.minLength(6)]),
      cnfpassword : new FormControl('', [Validators.required, Validators.minLength(6)]),
      phone : new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
      address : new FormControl('', [Validators.required]),
      dob : new FormControl('', [Validators.required]),
      profileImage : new FormControl('', [])
    });
  }

  ngOnInit() {
    this.captchaSiteKey = '6Lc999EUAAAAAFkBL3KmtXZU8DYD-CW4qpxCoQvG';
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

  onDate = (event) => {
    this.dobDate = event;
    this.dobDate = moment(this.dobDate).format('MM/DD/YYYY');
    console.log(this.dobDate);
  }

  onFileSelected = (event) => {
    const file = (event.target as HTMLInputElement).files[0];
    this.signupForm.patchValue({profileImage : file});
    this.signupForm.get('profileImage').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.showImage = reader.result as string;
    };
    reader.readAsDataURL(file);
    this.fd = new FormData();
    this.fd.append('file', this.signupForm.value.profileImage, this.signupForm.value.profileImage.name);
  }

  getImageStyle = () => {
    const myStyles = {
       // tslint:disable-next-line: max-line-length
       'background-image': !this.showImage ? 'url(\'https://www.seekpng.com/png/detail/115-1150053_avatar-png-transparent-png-royalty-free-default-user.png\')' : 'url(' + this.showImage + ')'
    };
    return myStyles;
  }

  onOtpChange = (evt) => {
    this.otpByUser = evt;
  }

  registerUser = () => {
    this.loader = true;
    this.error = false;
    this.errorMsg = '';
    if (this.signupForm.status === 'INVALID') {
      this.loader = false;
      return false;
    }
    this.dobDate = moment(this.signupForm.value.dob).format('MM/DD/YYYY');
    if (this.signupForm.value.password !== this.signupForm.value.cnfpassword) {
      this.pwdNotMatched = true;
      this.loader = false;
      return false;
    }
    this.userData = {
      username : this.signupForm.value.username,
      email : this.signupForm.value.email,
      password : this.signupForm.value.password,
      phone : this.signupForm.value.phone,
      address : this.signupForm.value.address,
      profileImage : '',
      dob : this.signupForm.value.dob,
    };

    this.httpService.checkUser(this.userData).subscribe((resObj) => {
      if (resObj.success) {
        if (this.fd !== undefined) {
          this.httpService.imageUploadCloud(this.fd).subscribe((res) => {
            if (res.success === true) {
              this.userData.profileImage = res.data;
              this.httpService.sendOtpToUser(this.userData.phone).subscribe((result) => {
                this.loader = false;
                this.pwdNotMatched = false;
                if (result.success) {
                  this.verifyScreen = true;
                  this.otpTimer();
                  this.otpRequestId = result.data;
                } else {
                  this.error = true;
                  this.errorMsg = result.message;
                }
              });
            } else {
              this.loader = false;
              this.error = true;
              this.errorMsg = res.message;
            }
          });
        } else {
          this.httpService.sendOtpToUser(this.userData.phone).subscribe((result) => {
            this.loader = false;
            this.pwdNotMatched = false;
            if (result.success) {
              this.verifyScreen = true;
              this.otpTimer();
              this.otpRequestId = result.data;
            } else {
              this.error = true;
              this.errorMsg = result.message;
            }
          });
        }
      } else {
        this.disableSbt = true;
        this.loader = false;
        this.error = true;
        this.errorMsg = resObj.message;
      }
    });
  }

  otpTimer = () => {
    let timeleft = 60;
    this.downloadTimer = setInterval(() => {
      timeleft--;
      document.getElementById('timer').textContent = String(timeleft);
      if (timeleft <= 0) {
        clearInterval(this.downloadTimer);
      }
      if (timeleft === 0) {
        document.getElementById('timer').textContent = '';
        this.verifyBtnDisable = true;
      }
    }, 1000);
  }

  resolved(captchaResponse: string) {
    const secretKey = '6Lc999EUAAAAALc5chiKMwfBhpVlDNXRcsk_YR77';
    this.httpService.verifyCaptcha(captchaResponse,secretKey).subscribe((res) => {
      if (res.success) {
        this.disableSbt = false;
      }
    })
  }

  verifyOTP = () => {
    this.loader = true;
    if (this.otpByUser === undefined) {
      this.error = true;
      this.loader = false;
      this.errorMsg = 'please provide OTP';
      return;
    }
    this.error = false;
    this.errorMsg = '';
    this.httpService.verifyOTP(this.otpRequestId, this.otpByUser).subscribe((result) => {
      console.log(result);
      if (result.success) {
        this.httpService.userSignup(this.userData).subscribe((res) => {
          console.log(res);
          this.loader = false;
          this.signupForm.reset();
          if (res.success === true) {
            this.router.navigate(['/login']);
          } else {
            this.error = true;
            this.errorMsg = result.message;
          }
        });
      } else {
        this.loader = false;
        this.error = true;
        this.errorMsg = result.message;
      }
    });
  }

  resendOtp = () => {
    this.error = false;
    this.errorMsg = '';
    this.verifyBtnDisable = !this.verifyBtnDisable;
    this.httpService.cancelOtpPreReq(this.otpRequestId).subscribe((res) => {
      if (res.success) {
        this.httpService.sendOtpToUser(this.userData.phone).subscribe((result) => {
          clearInterval(this.downloadTimer);
          if (result.success) {
            this.otpTimer();
            this.otpRequestId = result.data;
          } else {
            this.error = true;
            this.errorMsg = result.message;
          }
        });
      } else {
        this.error = true;
        this.errorMsg = res.message;
      }
    });
  }

}
