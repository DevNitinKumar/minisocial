import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthServiceMain } from '../services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  authStatus$: Observable<boolean>;
  checkUser: boolean;

  constructor(private AuthServiceMain: AuthServiceMain) { }

  ngOnInit() {
    this.checkUser = this.AuthServiceMain.getIsAuth();
    this.AuthServiceMain.authStatus.subscribe((res) => {
      this.checkUser = res;
    });
  }

}
