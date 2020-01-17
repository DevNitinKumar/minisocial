import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-paytm-payment-success',
  templateUrl: './paytm-payment-success.component.html',
  styleUrls: ['./paytm-payment-success.component.css']
})
export class PaytmPaymentSuccessComponent implements OnInit {
  loader: boolean;
  payerData: any;
  currency: any;
  gateway: any;
  bankname: any;
  paymode: any;
  mid: any;
  rescode: any;
  txnId: any;
  orderId: any;
  bankTxnId: any;
  amount: any;
  txnDate: any;
  userData: any;
  paymentFailure: boolean;

  constructor(private activatedRoute: ActivatedRoute, private httpService: HttpService) { }

  ngOnInit() {
    this.loader = true;
    this.activatedRoute.queryParams.subscribe(params => {
      this.loader = false;
      this.currency = params.currency;
      this.gateway = params.gateway;
      this.bankname = params.bankname;
      this.paymode = params.paymode;
      this.mid = params.mid;
      this.rescode = params.rescode;
      this.txnId = params.txnId;
      this.orderId = params.orderId;
      this.bankTxnId = params.bankTxnId;
      this.amount = params.amount;
      this.txnDate = params.txnDate;
    });
    if(this.gateway === '') {
      this.paymentFailure = true;
    } else {
      this.paymentFailure = false;
    }
    this.getUserProfile();
  }

  getUserProfile = () => {
    this.httpService.getUserProfile().subscribe((res) => {
      this.userData = res.data;
    });
  }

  

}
