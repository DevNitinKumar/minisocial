import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {
  userData: any;
  allFollowers: any;
  loader: boolean;
  textSearch = '';
  searchStart: boolean;
  noResult: boolean;

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.getUserProfile();
  }

  getUserProfile = () => {
    this.httpService.getUserProfile().subscribe((res) => {
      this.searchStart = false;
      this.userData = res.data;
      this.allFollowers = res.data.followers;
    });
  }

  unfollowUser = (userData) => {
    this.loader = true;
    this.httpService.unfollowUser(userData).subscribe((res) => {
      this.loader = false;
      if (res.success) {
        this.getUserProfile();
      }
    });
  }

  searchFollower = () => {
    this.searchStart = true;
    if (this.textSearch !== '') {
      this.httpService.filterFollower(this.textSearch).subscribe((res) => {
        this.searchStart = false;
        if (res.success) {
          this.allFollowers = res.data;
          if (res.data.length === 0) {
            this.noResult = true;
          }
        }
      });
    } else {
      this.getUserProfile();
    }
  }


}
