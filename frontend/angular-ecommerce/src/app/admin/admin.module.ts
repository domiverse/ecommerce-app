import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';


@NgModule({
  declarations: [
    AdminComponent,
    AdminLayoutComponent,
    ProductManagementComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
