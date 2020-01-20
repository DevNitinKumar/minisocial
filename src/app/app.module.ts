import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import {
  MatSliderModule,
  MatTabsModule,
  MatToolbarModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatInputModule,
  MatButtonModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatBadgeModule,
  MatMenuModule,
  MatTooltipModule
} from '@angular/material';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostsComponent } from './posts/posts.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from './services/http.service';
import { AuthGuard } from './services/auth.gaurd';
import { AuthService } from './services/auth.service';
import { Restrict } from './services/restrict.guard';
import { InterceptHeaderHttps } from './services/intercept.header.https';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { DatePipe } from './services/dateformat.pipe';
import { PostCommentComponent } from './post-comment/post-comment.component';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { PeopleComponent } from './people/people.component';
import { TestComponent } from './test/test.component';
import { ReportComponent } from './report/report.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FollowingComponent } from './following/following.component';
import { FollowersComponent } from './followers/followers.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { TruncatePipe } from './services/turncatePipe';
import { ChatComponent } from './chat/chat.component';
import { NgxAutoScrollModule } from 'ngx-auto-scroll';
// import { EmojiPickerModule } from 'angular2-emoji-picker';
import { AgmCoreModule } from '@agm/core';
import { MapsService } from './services/map.service';
import {WebcamModule} from 'ngx-webcam';
import { PaymentComponent } from './payment/payment.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaytmPaymentSuccessComponent } from './paytm-payment-success/paytm-payment-success.component';
// tslint:disable-next-line: import-spacing
import { NgOtpInputModule } from 'ng-otp-input';
import { RecaptchaModule } from 'ng-recaptcha';
import {MatProgressBarModule} from '@angular/material/progress-bar';


const appRoutes: Routes = [
  { path : 'login', component : LoginComponent },
  { path : 'signup', component : SignupComponent },
  { path : 'forgot-password', component : ForgotPasswordComponent },
  { path : 'payment', canActivate : [AuthGuard], component : PaymentComponent },
  { path : 'payment-success', canActivate : [AuthGuard], component : PaymentSuccessComponent },
  { path : 'paytm-payment-success', canActivate : [AuthGuard], component : PaytmPaymentSuccessComponent },
  { path : 'dashboard', canActivate : [AuthGuard], component : DashboardComponent },
  { path : 'profile', canActivate : [AuthGuard], component : UserProfileComponent },
  { path : 'edit-profile', canActivate : [AuthGuard], component : EditProfileComponent },
  { path : 'comment', canActivate : [AuthGuard], component : PostCommentComponent },
  { path : 'people', canActivate : [AuthGuard], component : PeopleComponent },
  { path : 'people/following', canActivate : [AuthGuard], component : FollowingComponent },
  { path : 'people/follower', canActivate : [AuthGuard], component : FollowersComponent },
  { path : 'notifications', canActivate : [AuthGuard], component : NotificationsComponent },
  { path : 'test', component : TestComponent },
  { path : 'report', component : ReportComponent },
  { path : '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    PostsComponent,
    UserProfileComponent,
    DatePipe,
    EditProfileComponent,
    PostCommentComponent,
    SidemenuComponent,
    PeopleComponent,
    TestComponent,
    ReportComponent,
    ForgotPasswordComponent,
    FollowingComponent,
    FollowersComponent,
    NotificationsComponent,
    TruncatePipe,
    ChatComponent,
    PaymentComponent,
    PaymentSuccessComponent,
    PaytmPaymentSuccessComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true } // <-- debugging purposes only
    ),
    AgmCoreModule.forRoot({
      // apiKey : 'AIzaSyAQoW8KzASlmvBTEXzBm9Ki7bTx6eotR5Q'
      apiKey : 'AIzaSyB_G7ern6dzWvSUGnVtT2shOG98xXqpZbQ', libraries: ['places']
    }),
    // EmojiPickerModule.forRoot(),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatTabsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatMenuModule,
    MatTooltipModule,
    NgxAutoScrollModule,
    WebcamModule,
    NgOtpInputModule,
    RecaptchaModule,
    MatProgressBarModule
  ],
  exports : [
    HeaderComponent
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptHeaderHttps,
    multi: true
  }, HttpService, AuthGuard, AuthService, MapsService, Restrict, HeaderComponent],
  bootstrap: [AppComponent],
  entryComponents: [ChatComponent]
})
export class AppModule { }
