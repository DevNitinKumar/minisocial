import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import io from 'socket.io-client';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  userData: any;
  allNotifications: any;
  socket: any;

  constructor(private httpService: HttpService,private Header : HeaderComponent,private router : Router) {
    // this.socket = io('http://localhost:3800');
    this.socket = io('https://minisocialmedia.herokuapp.com');
  }

  ngOnInit() {
    this.getUserProfile();
    this.socket.on('refreshPage', data => {
      this.getUserProfile();
    });
  }

  getUserProfile = () => {
    this.httpService.getUserProfile().subscribe((res) => {
      this.userData = res.data;
      this.allNotifications = res.data.notifications;
    });
  }

  markNotification = (id) => {
    this.httpService.clearNotification(id).subscribe((res) => {
      this.getUserProfile();
      this.socket.emit('refresh', {});
    });
  }

  deleteNotification = (id) => {
    this.httpService.clearNotification(id, true).subscribe((res) => {
      this.getUserProfile();
      this.socket.emit('refresh', {});
    });
  }

}
