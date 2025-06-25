import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CartService } from '../../services/cart.service';
@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup; // Sử dụng ! để báo rằng nó sẽ được khởi tạo trong ngOnInit

  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Lấy thông tin giỏ hàng từ service
    this.reviewCartDetails();

    // Khởi tạo form
    this.checkoutFormGroup = this.formBuilder.group({
      // Nhóm thông tin khách hàng
      customer: this.formBuilder.group({
        firstName: [""],
        lastName: [""],
        companyName: [""],
        email: [""],
        phone: [""],
      }),
      // Nhóm thông tin giao hàng
      shippingAddress: this.formBuilder.group({
        address: [""],
        orderNotes: [""],
      }),
      // Nhóm thông tin thẻ tín dụng (ví dụ)
      creditCard: this.formBuilder.group({
        cardType: [""],
        nameOnCard: [""],
        cardNumber: [""],
        securityCode: [""],
        expirationMonth: [""],
        expirationYear: [""],
      }),
    });
  }

  reviewCartDetails() {
    // Đăng ký lắng nghe sự kiện tổng giá tiền từ service
    this.cartService.totalPrice.subscribe((data) => (this.totalPrice = data));

    // Đăng ký lắng nghe sự kiện tổng số lượng từ service
    this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );

    // Bắt đầu tính toán lại nếu cần
    this.cartService.computeCartTotals();
  }

  onSubmit() {
    console.log("Handling the submit button");

    // Lấy dữ liệu từ form
    const customerInfo = this.checkoutFormGroup.get("customer")?.value;
    const shippingInfo = this.checkoutFormGroup.get("shippingAddress")?.value;

    console.log("Customer Info:", customerInfo);
    console.log("Shipping Info:", shippingInfo);

    // Tại đây, bạn sẽ gọi một service để gửi dữ liệu đơn hàng lên backend
    // Ví dụ: this.checkoutService.placeOrder({ ... }).subscribe(...)
  }
}