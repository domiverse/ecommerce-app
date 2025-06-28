import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VietnameseAddressService {

  private baseUrl = 'https://provinces.open-api.vn/api';

  constructor(private httpClient: HttpClient) { }

  getProvinces(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/p/`);
  }

  getDistricts(provinceCode: number): Observable<any[]> {
    // API trả về một đối tượng {..., districts: [...]}, chúng ta cần trích xuất mảng districts
    return this.httpClient.get<any>(`${this.baseUrl}/p/${provinceCode}?depth=2`).pipe(
      map(response => response.districts)
    );
  }

  getWards(districtCode: number): Observable<any[]> {
    // Tương tự, API trả về {..., wards: [...]}, chúng ta cần trích xuất mảng wards
    return this.httpClient.get<any>(`${this.baseUrl}/d/${districtCode}?depth=2`).pipe(
      map(response => response.wards)
    );
  }
}