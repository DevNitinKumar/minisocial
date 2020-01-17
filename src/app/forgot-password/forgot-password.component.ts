import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  resetPwdForm: any;
  loader: boolean;
  msg: string;
  disabled: boolean = false;
  showMsg: boolean;
  errorMsg: boolean;

  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private router: Router) { 
    this.resetPwdForm = this.formBuilder.group({
      email : new FormControl('', [Validators.required, Validators.email])
    });
  }

  ngOnInit() {
  }

  resetPassword = () => {
    this.loader = true;
    if (!this.resetPwdForm.valid) {
      this.loader = false;
      return false;
    }
    this.disabled = true;
    this.httpService.userForgotPwd(this.resetPwdForm.value.email).subscribe((res) => {
      this.showMsg = true;
      this.resetPwdForm.reset();
      this.disabled = false;
      if (res.success) {
        this.loader = false;
        this.errorMsg = false;
        this.msg = res.message;
      } else {
        this.loader = false;
        this.errorMsg = true;
        this.msg = res.message;
      }
    })
  }

}
