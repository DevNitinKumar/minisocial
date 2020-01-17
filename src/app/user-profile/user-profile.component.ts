import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userData: any;
  loader = false;

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.getUserProfile();
  }


  getUserProfile = () => {
    this.loader = true;
    this.httpService.getUserProfile().subscribe((res) => {
      if (res.success === true) {
        this.loader = false;
        this.userData = res.data;
      }
    });
  }

}
