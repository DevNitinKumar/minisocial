import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpService } from '../services/http.service';
import * as _ from 'lodash';
import io from 'socket.io-client';
import { ChatComponent } from '../chat/chat.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  decodedToken: any;
  userData: any;
  allUsers: any;
  singleUser: any;
  userArr = [];
  socket: any;
  onlineUsers: any;
  showSearch = true;
  textSearch = '';
  filteredUsers: any;
  noResult: boolean;

  constructor(private httpService: HttpService, public dialog: MatDialog) {
    this.socket = io('http://localhost:3800');
    const helper = new JwtHelperService();
    this.decodedToken = helper.decodeToken(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.getUserProfile();
    this.getAllUsers();
    this.socket.on('refreshPage', data => {
      this.getUserProfile();
    });
  }

  toggleSearchInput = () => {
    this.showSearch = !this.showSearch;
  }

  openDialog(username, onlineUsers): void {
    const dialogRef = this.dialog.open(ChatComponent, {
      height: '500px',
      width: '600px',
      data : { username, onlineUsers }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  getUserProfile = () => {
    this.httpService.getUserProfile().subscribe((res) => {
      this.userData = res.data;
      this.userArr = res.data.following;
    });
  }

  getAllUsers = () => {
    this.httpService.getAllUsers().subscribe((res) => {
      this.filteredUsers = res.data;
      this.allUsers = this.filteredUsers;
    });
  }

  followUser = (user) => {
    this.httpService.followUser(user).subscribe((res) => {
      if (res.success) {
        this.getUserProfile();
        this.socket.emit('refresh', {});
      }
    });
  }

  checkInArray = (arr, id) => {
    const isFound =  _.find(arr, [ 'userFollowedId._id' , id ]);
    if (isFound) {
      return true;
    } else {
      return false;
    }
  }

  onlineUsersList = (list) => {
    this.onlineUsers = list;
  }

  checkIfOnline = (name) => {
    const result = _.indexOf(this.onlineUsers, name);
    if (result > -1) {
        return true;
      } else {
        return false;
      }
  }

  searchPeople = () => {
    if (this.textSearch !== '') {
      this.filterPeople();
    } else {
      this.allUsers = this.filteredUsers;
    }
  }

  filterPeople = () => {
    this.allUsers = this.filteredUsers.filter((event) => {
        return (this.filterUsername(event) || this.filterAddress(event));
    });
    if (this.allUsers.length === 0) {
      this.noResult = true;
    }
  }

  filterUsername(event) {
    return event.username != null && !(event.username.search(RegExp(this.textSearch, 'i')) === -1);
  }

  filterAddress(event) {
    return event.address != null && !(event.address.search(RegExp(this.textSearch, 'i')) === -1);
  }

}
