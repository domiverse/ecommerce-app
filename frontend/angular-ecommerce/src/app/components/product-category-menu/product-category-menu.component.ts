// src/app/components/product-category-menu/product-category-menu.component.ts

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-category-menu',
  standalone: false,
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css'] 
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[] = [];
  
  // === PHẦN LOGIC MỚI BỊ THIẾU ===
  isProductMenuOpen: boolean = false; // Biến trạng thái cho menu con

  currentYear: number = new Date().getFullYear(); 

  // Inject Router vào constructor
  constructor(private productService: ProductService, private router: Router) {}
  // =================================

  ngOnInit(): void { // Thêm kiểu trả về void cho rõ ràng
    this.listProductCategories();

    // Theo dõi thay đổi route để đóng/mở menu hợp lý
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Tự động mở menu sản phẩm nếu người dùng đang ở trang sản phẩm
      this.isProductMenuOpen = this.isProductsRouteActive();
    });
  }

  listProductCategories(): void {
    this.productService.getProductCategories().subscribe(
      data => {
        console.log('Product Categories=' + JSON.stringify(data));
        this.productCategories = data;
      }
    );
  }

  // === CÁC HÀM MỚI BỊ THIẾU ===

  // Hàm để bật/tắt menu con
  toggleProductMenu(): void {
    this.isProductMenuOpen = !this.isProductMenuOpen;
  }

  // Hàm để kiểm tra xem có đang ở trang sản phẩm không để làm sáng link "Products"
  isProductsRouteActive(): boolean {
    // Trả về true nếu URL hiện tại chứa '/category' hoặc '/products'
    return this.router.url.includes('/category') || this.router.url.includes('/products') || this.router.url.includes('/search');
  }
  // ============================
}