import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

interface IPInfo {
    latitude: string;
    longitude: string;
    country_name: string;
    city: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor(private http: HttpClient) { }

    getIPInfo() {
        return this.http.get<IPInfo>("https://ipapi.co/json/")
    }
};