import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import io from 'socket.io-client';
import { Subject, Observable } from 'rxjs';
import {WebcamImage} from 'ngx-webcam';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userData: any;
  socket: any; public seconds: number ;
  
  constructor(private httpService: HttpService) {
    this.socket = io('https://minisocialmedia.herokuapp.com');
  }

  ngOnInit() {
    this.getUserProfile();
  }

  getUserProfile = () => {
    this.httpService.getUserProfile().subscribe((res) => {
      this.userData = res.data;
    });
  }

  // private trigger: Subject<void> = new Subject<void>();

  // // latest snapshot
  // public webcamImage: WebcamImage = null;

  // public triggerSnapshot(): void {
  //   this.seconds = 3;
  //   setTimeout(() => {
  //     this.seconds = 2;
  //     setTimeout(() => {
  //       this.seconds = 1;
  //       setTimeout(() => {
  //         this.trigger.next();
  //         this.seconds = null;
  //       }, 2000);
  //     }, 2000); 
  //   }, 2000);

  // }

  // public handleImage(webcamImage: WebcamImage): void {
  //   // tslint:disable-next-line: no-console
  //   console.info('received webcam image', webcamImage);
  //   this.webcamImage = webcamImage;
  // }

  // public get triggerObservable(): Observable<void> {
  //   return this.trigger.asObservable();
  // }

}
