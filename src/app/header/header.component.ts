import { Component, OnInit, ViewEncapsulation, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { AuthServiceMain } from '../services/auth.service';
import { Observable } from 'rxjs';
import { HttpService } from '../services/http.service';
import * as _ from 'lodash';
import io from 'socket.io-client';
import { ChatComponent } from '../chat/chat.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @Output() OnlineUsers = new EventEmitter();
  authStatus$: Observable<boolean>;
  checkUser: boolean;
  userData: any;
  allNotifications: any;
  count = [];
  socket: any;
  chatList: any;
  msgNumber: any = 0;
  onlineUsersList: any;

  constructor(private AuthServiceMain: AuthServiceMain,private router: Router, private httpService: HttpService, public dialog: MatDialog) {
    // this.socket = io('http://localhost:3800');
    this.socket = io('https://minisocialmedia.herokuapp.com');
  }

  ngOnInit() {
    // this.checkUser = this.AuthServiceMain.getIsAuth();
    // this.AuthServiceMain.authStatus.subscribe((res) => {
    //   this.checkUser = res;
    // });
    this.getUserProfile();
    this.socket.on('refreshPage', data => {
      this.getUserProfile();
    });
  }

  ngAfterViewInit() {
    this.socket.on('usersOnline', data => {
      this.onlineUsersList = data;
      this.OnlineUsers.emit(data);
    });
  }


  logoutUser = () => {
    this.socket.emit('disconnect', {});
    // this.socket.on('usersOnline', data => {
    //   console.log(data);
    //   this.onlineUsersList = data;
    //   this.OnlineUsers.emit(data);
    // });
    this.AuthServiceMain.logout();
  }

  getUserProfile = () => {
    this.httpService.getUserProfile().subscribe((res) => {
      this.userData = res.data;
      this.socket.emit('onlineUser',{room : 'global',user : this.userData.username});
      this.allNotifications = res.data.notifications;
      const value = _.filter(this.allNotifications, ['isRead', false]);
      this.count = value;
      this.chatList = res.data.chatList;
      this.checkIfRead(this.chatList);
    });
  }

  checkIfRead = (arr) => {
    const chatsArr = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < arr.length ; i++) {
      const receiver = arr[i].msgId.message[arr[i].msgId.message.length - 1];
      if (receiver.isRead === false && receiver.receiverName === this.userData.username) {
        chatsArr.push(1);
        this.msgNumber = _.sum(chatsArr);
      }
    }
  }

  markAllAsRead = () => {
    this.httpService.markAllAsRead().subscribe((res) => {
      this.getUserProfile();
      this.socket.emit('refresh', {});
    });
  }

  markAllMsgsAsRead = () => {
    this.httpService.markAllMsgsAsRead(this.userData.username).subscribe((res) => {
      this.getUserProfile();
      this.socket.emit('refresh', {});
      this.msgNumber = 0;
    });
  }

  openChatDialog = (username) => {
    this.socket.emit('refresh', {});
    const dialogRef = this.dialog.open(ChatComponent, {
      height: '500px',
      width: '600px',
      data : { username,onlineUsers : this.onlineUsersList }
    });

    this.httpService.markChatMsgs(this.userData.username,username).subscribe((res) => {
      this.getUserProfile();
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openHome = () => {
    this.router.navigate(['/dashboard']);
  }

}
