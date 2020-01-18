import { Component, OnInit, AfterViewChecked, AfterViewInit, ApplicationRef } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Router } from '@angular/router';
declare let paypal: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, AfterViewInit {
  finalAmt = '10';
  htmlToAdd: string;
  processPayment: boolean;
  paymentData: any;
  loader: boolean;

  constructor(private httpService: HttpService, private router: Router,private appRef: ApplicationRef) { }

  ngOnInit() { }

  ngAfterViewInit() {
    paypal.Button.render({
      env: 'sandbox',
      client: {
        production: '',
        sandbox: 'AfyHKbfTBvcLrCThwwdkA9SK3LdhzLEbUJABiV3_xEgSy2A5qeA7MgjeUBH_nhT2P1gGcbBRoX62hwz1'
      },
      commit: true,
      payment (data, actions) {
        return actions.payment.create({
          payment: {
            transactions: [
              {
                amount: { total: '10', currency: 'INR' }
              }
            ],
            redirect_urls: {
              // return_url: 'http://localhost:4000/payment-success',
              // cancel_url: 'http://localhost:4000/failure'
              return_url: 'https://minisocialmedia.herokuapp.com/payment-success',
              cancel_url: 'https://minisocialmedia.herokuapp.com/failure'
            }
          }
        });
      },
      onAuthorize(data, actions) {
        return actions.payment.execute().then((payment) => {
          console.log(payment);
          return actions.redirect();
        });
      }
    }, '#paypal-button');
  }

  paytmPaymentCheckout = () => {
    // this.loader = true;
    this.httpService.paytmCheckout(this.finalAmt).subscribe(async (res) => {
      if (res.success) {
        this.loader = false;
        this.processPayment = true;
        this.paymentData = res.data;
        this.appRef.tick();
        const form: HTMLFormElement = document.getElementById('paytm_form') as HTMLFormElement;
        await form.submit();
      }
    });
  }

}

