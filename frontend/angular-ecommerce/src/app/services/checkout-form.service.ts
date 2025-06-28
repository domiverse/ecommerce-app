import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutFormService {

  constructor() { }

  // Định nghĩa hàm getCreditCardMonths
  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];
    // build an array for "Month" dropdown list
    // - start at current month and loop thru
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    // 'of' operator from rxjs will wrap an object as an Observable
    return of(data);
  }

  // Định nghĩa hàm getCreditCardYears
  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }
    return of(data);
  }
}