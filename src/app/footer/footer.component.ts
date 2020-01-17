import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  authStatus$: Observable<boolean>;
  checkUser: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.checkUser = this.authService.getIsAuth();
    this.authService.authStatus.subscribe((res) => {
      this.checkUser = res;
    });
  }

}
