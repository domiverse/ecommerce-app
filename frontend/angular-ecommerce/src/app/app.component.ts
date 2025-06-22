import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-ecommerce';
  // Biến để theo dõi trạng thái của sidebar (mặc định là đang mở)
  isSidebarCollapsed = false;

  // Phương thức để đảo ngược trạng thái của sidebar
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
