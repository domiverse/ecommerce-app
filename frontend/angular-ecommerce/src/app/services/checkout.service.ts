import { Purchase } from './../common/purchase';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl = 'http://localhost:8081/api/checkout/purchase';

  constructor(private httpClient: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<any> {

    // 1. Định nghĩa header
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    // 2. Thêm httpOptions vào lời gọi API
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase, httpOptions);
  }
}
