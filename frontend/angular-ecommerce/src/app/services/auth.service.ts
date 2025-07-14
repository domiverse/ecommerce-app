import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Customer } from '../common/customer'; // Giả sử bạn đã có model này

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8081/api/auth';
  
  // Dùng BehaviorSubject để lưu trạng thái người dùng hiện tại
  public currentUser = new BehaviorSubject<Customer | null>(null);

  constructor(private http: HttpClient) { }

  // Lấy thông tin người dùng khi tải lại trang
  checkLoginStatus(): Observable<Customer | null> {
    return this.http.get<Customer>(`${this.baseUrl}/me`).pipe(
      tap(user => this.currentUser.next(user))
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials, {responseType: 'text'}).pipe(
      // Sau khi đăng nhập thành công, gọi lại checkLoginStatus để cập nhật currentUser
      tap(() => this.checkLoginStatus().subscribe())
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, {responseType: 'text'}).pipe(
      tap(() => this.currentUser.next(null)) // Cập nhật trạng thái là đã đăng xuất
    );
  }
}