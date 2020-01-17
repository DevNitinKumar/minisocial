import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SidemenuComponent implements OnInit {
  loader = false;
  postCount: any;
  followerCount: any;
  followingCount: any;

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.getUserProfile();
  }

  getUserProfile = () => {
    this.loader = true;
    this.httpService.getUserProfile().subscribe((res) => {
      if (res.success === true) {
        this.loader = false;
        this.postCount = res.data.posts;
        this.followerCount = res.data.followers;
        this.followingCount = res.data.following;
      }
    });
  }

}
