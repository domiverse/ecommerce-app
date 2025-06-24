import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-status',
  standalone: false,
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.css'
})
export class CartStatusComponent implements OnInit {

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus() {

    // Đăng ký lắng nghe sự kiện từ totalPrice của CartService
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // Đăng ký lắng nghe sự kiện từ totalQuantity của CartService
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }
}