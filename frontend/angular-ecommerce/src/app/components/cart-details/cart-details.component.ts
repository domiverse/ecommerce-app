import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-cart-details',
  standalone: false,
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})

export class CartDetailsComponent implements OnInit {

  // KHAI BÁO CÁC THUỘC TÍNH ĐỂ HTML CÓ THỂ SỬ DỤNG
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {

    // Lấy một handle đến các cartItems trong service
    this.cartItems = this.cartService.cartItems;

    // Đăng ký lắng nghe sự kiện tổng giá tiền
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // Đăng ký lắng nghe sự kiện tổng số lượng
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // Tính toán lại tổng giá trị giỏ hàng
    this.cartService.computeCartTotals();
  }

  // KHAI BÁO CÁC HÀM ĐỂ HTML CÓ THỂ GỌI
  incrementQuantity(theCartItem: CartItem) {
    this.cartService.addToCart(theCartItem);
  }

  decrementQuantity(theCartItem: CartItem) {
    this.cartService.decrementQuantity(theCartItem);
  }

  remove(theCartItem: CartItem) {
    this.cartService.remove(theCartItem);
  }
}
