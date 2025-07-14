import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
// import { AuthService } from './auth.service'; // Service quản lý đăng nhập

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router /*, private authService: AuthService */) {}

  canActivate(): boolean {
    // ✨ LOGIC GIẢ ĐỊNH - BẠN SẼ THAY BẰNG LOGIC THỰC TẾ ✨
    // const isLoggedIn = this.authService.isLoggedIn();
    // const isAdmin = this.authService.hasRole('ROLE_ADMIN');

    const isLoggedIn = true; // Giả sử đã đăng nhập
    const isAdmin = true;    // Giả sử là admin

    if (isLoggedIn && isAdmin) {
      return true; // Cho phép truy cập
    } else {
      // Nếu không phải admin, chuyển hướng về trang chủ hoặc trang login
      this.router.navigate(['/']); 
      return false;
    }
  }
}