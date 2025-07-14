import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Kiểm tra trạng thái đăng nhập mỗi khi ứng dụng được tải
    this.authService.checkLoginStatus().subscribe();
  }
    logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Chuyển hướng về trang chủ sau khi đăng xuất thành công
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        console.error('Logout failed', err);
      }
    });
  }
  title = 'angular-ecommerce';
  // Biến để theo dõi trạng thái của sidebar (mặc định là đang mở)
  isSidebarCollapsed = true;

  // Phương thức để đảo ngược trạng thái của sidebar
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  // Phương thức MỞ sidebar khi di chuột vào nút hamburger
  openSidebar(): void {
    this.isSidebarCollapsed = false;
  }

  // Phương thức ĐÓNG sidebar khi di chuột ra khỏi vùng sidebar
  closeSidebar(): void {
    this.isSidebarCollapsed = true;
  }
}
