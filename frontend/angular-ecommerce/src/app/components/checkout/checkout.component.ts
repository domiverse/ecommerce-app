import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CartService } from '../../services/cart.service';
@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  // KHAI BÁO BIẾN ĐỂ THEO DÕI PHƯƠNG THỨC THANH TOÁN
  selectedPaymentMethod: string = '';

  constructor(private formBuilder: FormBuilder,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        companyName: [''],
        email: [''],
        phone: ['']
      }),
      shippingAddress: this.formBuilder.group({
        address: [''],
        orderNotes: ['']
      }),
      // THÊM MỚI FORM GROUP CHO THANH TOÁN
      payment: this.formBuilder.group({
        paymentMethod: new FormControl(''), // Để lưu giá trị radio button
        // Các trường cho thẻ tín dụng
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // Cung cấp dữ liệu cho tháng/năm hết hạn của thẻ
    const startMonth: number = new Date().getMonth() + 1;
    this.getCreditCardMonths(startMonth);
    this.getCreditCardYears();
  }

  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(totalQuantity => this.totalQuantity = totalQuantity);
    this.cartService.totalPrice.subscribe(totalPrice => this.totalPrice = totalPrice);
  }

  // HÀM MỚI: ĐƯỢC GỌI KHI NGƯỜI DÙNG CHỌN PHƯƠNG THỨC THANH TOÁN
  onPaymentMethodChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedPaymentMethod = target.value;
  }

  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The email address is " + this.checkoutFormGroup.get('customer.email')?.value);
  }

  // Các hàm helper cho tháng/năm
  getCreditCardMonths(startMonth: number) {
    let data: number[] = [];
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    this.creditCardMonths = data;
  }

  getCreditCardYears() {
    let data: number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }
    this.creditCardYears = data;
  }
}