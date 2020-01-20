import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  loader: boolean;
  userData: any;
  showImage: string;
  profileEditForm: any;
  userImagePath: any;
  error: boolean;
  errorMsg: string;
  disableBtn: boolean;

  constructor(private httpService: HttpService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.getUserProfile();
    this.profileEditForm = this.formBuilder.group({
      username : new FormControl('', [Validators.required]),
      email : new FormControl('', [Validators.required, Validators.email]),
      phone : new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
      address : new FormControl('', [Validators.required]),
      profileImage : new FormControl('', [])
    });
  }

  getUserProfile = () => {
    this.loader = true;
    this.httpService.getUserProfile().subscribe((res) => {
      if (res.success === true) {
        this.loader = false;
        this.userData = res.data;
        this.profileEditForm.patchValue({
          username : this.userData.username,
          email : this.userData.email,
          phone : this.userData.phone,
          address : this.userData.address,
          profileImage : this.userData.profileImage
        });
      }
    });
  }

  onFileSelected = (event) => {
    this.disableBtn = true;
    const file = (event.target as HTMLInputElement).files[0];
    this.profileEditForm.patchValue({profileImage : file});
    this.profileEditForm.get('profileImage').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.showImage = reader.result as string;
    };
    reader.readAsDataURL(file);
    const fd = new FormData();
    fd.append('file', this.profileEditForm.value.profileImage, this.profileEditForm.value.profileImage.name);
    this.httpService.imageUploadS3(fd).subscribe((res) => {
      this.disableBtn = false;
      if (res.success === true) {
        this.profileEditForm.value.profileImage = res.data;
      } else {
        this.error = true;
        this.errorMsg = res.message;
      }
    });
  }

  getImageStyle = () => {
    console.log(this.showImage);
    const myStyles = {
      // tslint:disable-next-line: max-line-length
      // 'background-image': !this.showImage ? 'url(http://localhost:3800/' + this.userData.profileImage + ')' : 'url(' + this.showImage + ')'
       'background-image': !this.showImage ? 'url(../../assets/img/default-profile-image.jpg)' : 'url(' + this.showImage + ')'
    };
    return myStyles;
  }

  editUserProfile = () => {
    if (!this.profileEditForm.valid) {
      return false;
    }
    this.loader = true;
    const userData = {
      username : this.profileEditForm.value.username,
      email : this.profileEditForm.value.email,
      phone : this.profileEditForm.value.phone,
      address : this.profileEditForm.value.address,
      profileImage : this.profileEditForm.value.profileImage
    };
    this.httpService.updateUserData(userData).subscribe((result) => {
      this.loader = false;
      this.profileEditForm.reset();
      if (result.success === true) {
        this.router.navigate(['/profile']);
      } else {
        this.error = true;
        this.errorMsg = result.message;
      }
    });
  }

}
