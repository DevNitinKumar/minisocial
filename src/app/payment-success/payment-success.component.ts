import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  loader = false;
  payerData: any;

  constructor(private activatedRoute: ActivatedRoute, private httpService: HttpService) { }

  ngOnInit() {
    this.loader = true;
    this.activatedRoute.queryParams.subscribe(params => {
      const paymentId = params.paymentId;
      const payerId = params.PayerID;
      this.httpService.paymentCheckout(paymentId, payerId).subscribe((res) => {
        if (res.success) {
          this.loader = false;
          this.payerData = res.data;
        }
      });
    });
  }

}
