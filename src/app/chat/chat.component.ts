import { Component, OnInit, Inject, AfterViewInit, OnChanges, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { HttpService } from '../services/http.service';
import io from 'socket.io-client';
// import { CaretEvent, EmojiEvent, EmojiPickerOptions } from 'angular2-emoji-picker';
import * as _ from 'lodash';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  userData: any;
  receiverData: any;
  message: any;
  messageArray: any;
  socket: any;
  count = 0;
  typing = false;
  typingMessage: any;

  public eventMock;
  public eventPosMock;

  // public direction = Math.random() > 0.5 ? (Math.random() > 0.5 ? 'top' : 'bottom') : (Math.random() > 0.5 ? 'right' : 'left');
  public toggled = false;
  public content = ' ';

  // tslint:disable-next-line: variable-name
  // public _lastCaretEvent: CaretEvent;
  isOnline: boolean;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any, private httpService: HttpService) {
    this.socket = io('https://minisocialmedia.herokuapp.com:3800');
  }

  ngOnInit() {
    this.getCurrentUserProfile();

    this.socket.on('is_typing', data => {
      if (data.sender === this.receiverData.username) {
        this.typing = true;
      }
    });

    this.socket.on('has_stopped_typing', data => {
      if (data.sender === this.receiverData.username) {
        this.typing = false;
      }
    });
  }

  // handleSelection(event: EmojiEvent) {
  //   // tslint:disable-next-line: max-line-length
  //   this.content = this.content.slice(0, this._lastCaretEvent.caretOffset) + event.char + this.content.slice(this._lastCaretEvent.caretOffset);
  //   this.message = this.content;
  //   this.content = ' ';
  //   this.eventMock = JSON.stringify(event);

  // }

  // handleCurrentCaret(event: CaretEvent) {
  //   this._lastCaretEvent = event;
  //   this.eventPosMock = `{ caretOffset : ${event.caretOffset}, caretRange: Range{...}, textContent: ${event.textContent} }`;
  // }

  getCurrentUserProfile = () => {
    this.httpService.getUserProfile().subscribe((res) => {
      this.userData = res.data;
      this.getReciverUserDataByName(this.data);
    });
  }

  getReciverUserDataByName = (data) => {
    this.httpService.getUserByName(data).subscribe(res => {
      this.count++;
      this.receiverData = res.data;
      const result = _.indexOf(this.data.onlineUsers,this.receiverData.username);
      if(result > -1) {
        this.isOnline = true;
      } else {
        this.isOnline = false;
      }
      if (this.count === 1) {
        const params = {
          room1 : this.userData.username,
          room2 : this.receiverData.username
        };
        this.socket.emit('join chat', params);
      }
      // tslint:disable-next-line: no-shadowed-variable
      this.httpService.getChatMessage(this.userData._id, this.receiverData._id).subscribe(res => {
        this.message = '';
        if (res.data !== null) {
          this.messageArray = res.data.message;
        } else {
          this.messageArray = [];
        }
      });
    });
  }

  sendMessage = (senderId, sednerName, receiverId, recName) => {
    if (this.message === '') {
      return false;
    }
    this.httpService.sendChatMessage(senderId, sednerName, receiverId, recName, this.message).subscribe(res => {
      this.getReciverUserDataByName(this.data);
      this.socket.emit('refresh', {});
    });
  }

  msgTyping = () => {
    this.socket.emit('start_typing', {
      sender : this.userData.username,
      receiver : this.receiverData.username
    });

    if (this.typingMessage) {
      clearTimeout(this.typingMessage);
    }

    this.typingMessage = setTimeout(() => {
      this.socket.emit('stop_typing', {
        sender : this.userData.username,
        receiver : this.receiverData.username
      }, 500);
    });
  }

}
