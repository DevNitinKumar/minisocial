import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {
  userData: any;
  userArr: any;
  allFollowings: any;
  loader: boolean;

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.getUserProfile();
  }

  getUserProfile = () => {
    this.httpService.getUserProfile().subscribe((res) => {
      this.userData = res.data;
      this.allFollowings = res.data.following;
    });
  }

  unfollowUser = (userData) => {
    this.loader = true;
    this.httpService.unfollowUser(userData.userFollowedId).subscribe((res) => {
      this.loader = false;
      if (res.success) {
        this.getUserProfile();
      }
    });
  }

}
