import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
// import { AdminGuard } from '../services/admin.guard'; // Sẽ tạo sau

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    // canActivate: [AdminGuard], // Bảo vệ toàn bộ khu vực admin
    children: [
      { path: 'products', component: ProductManagementComponent },
      // { path: 'orders', component: OrderManagementComponent }, // Ví dụ cho tương lai
      { path: '', redirectTo: 'products', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }