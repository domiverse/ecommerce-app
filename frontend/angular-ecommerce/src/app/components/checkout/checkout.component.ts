import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CheckoutFormService } from '../../services/checkout-form.service';
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

  selectedPaymentMethod: string = '';

  // SỬA: Inject checkoutFormService
  constructor(private formBuilder: FormBuilder,
    private cartService: CartService,
    private checkoutFormService: CheckoutFormService) { } // Inject service

  ngOnInit(): void {
    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        // THÊM VALIDATORS
        firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        companyName: [''], // Tùy chọn, không cần validator
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10,11}$')])
      }),
      shippingAddress: this.formBuilder.group({
        address: new FormControl('', [Validators.required, Validators.minLength(2)]),
        orderNotes: ['']
      }),
      payment: this.formBuilder.group({
        paymentMethod: new FormControl('', [Validators.required]),
        // THÊM VALIDATORS CHO THẺ TÍN DỤNG
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2)]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{16}$')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3}$')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    }
  );

  // Lấy danh sách năm
    this.checkoutFormService.getCreditCardYears().subscribe(
      (data: number[]) => {
        this.creditCardYears = data;
      }
    );

    // THÊM MỚI: Gọi hàm xử lý logic tháng/năm
    this.handleCreditCardMonths();
  }

  // THÊM MỚI: Hàm xử lý logic chính
  handleCreditCardMonths() {
    const creditCardFormGroup = this.checkoutFormGroup.get('payment');

    // Lắng nghe sự thay đổi của ô chọn NĂM
    creditCardFormGroup?.get('expirationYear')?.valueChanges.subscribe(
      yearString => {
        const selectedYear = Number(yearString);
        const currentYear = new Date().getFullYear();
        let startMonth: number;

        if (selectedYear === currentYear) {
          // Nếu là năm hiện tại, tháng bắt đầu là tháng hiện tại
          // Tháng trong new Date() là 0-indexed, nên cần +1
          startMonth = new Date().getMonth() + 1;
        } else {
          // Nếu là các năm trong tương lai, tháng bắt đầu là 1
          startMonth = 1;
        }

        // Gọi service để lấy lại danh sách tháng
        this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
          (data: number[]) => {
            this.creditCardMonths = data;
          }
        );
      }
    );
  }

  // THÊM: Các getter để dễ dàng truy cập form controls trong HTML
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }
  get phone() { return this.checkoutFormGroup.get('customer.phone'); }
  get shippingAddressAddress() { return this.checkoutFormGroup.get('shippingAddress.address'); }
  get paymentMethod() { return this.checkoutFormGroup.get('payment.paymentMethod'); }
  get nameOnCard() { return this.checkoutFormGroup.get('payment.nameOnCard'); }
  get cardNumber() { return this.checkoutFormGroup.get('payment.cardNumber'); }
  get securityCode() { return this.checkoutFormGroup.get('payment.securityCode'); }


  // SỬA: Cập nhật hàm này để set validator khi chọn phương thức thanh toán
  onPaymentMethodChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedPaymentMethod = target.value;

    // Nếu không phải credit card, xóa validators của các trường thẻ
    const creditCardControls = ['nameOnCard', 'cardNumber', 'securityCode'];
    if (this.selectedPaymentMethod !== 'creditCard') {
      creditCardControls.forEach(controlName => {
        this.checkoutFormGroup.get(`payment.${controlName}`)?.clearValidators();
        this.checkoutFormGroup.get(`payment.${controlName}`)?.updateValueAndValidity();
      });
    } else {
      // Nếu là credit card, đặt lại validators
      this.checkoutFormGroup.get('payment.nameOnCard')?.setValidators([Validators.required, Validators.minLength(2)]);
      this.checkoutFormGroup.get('payment.cardNumber')?.setValidators([Validators.required, Validators.pattern('^[0-9]{16}$')]);
      this.checkoutFormGroup.get('payment.securityCode')?.setValidators([Validators.required, Validators.pattern('^[0-9]{3}$')]);
      creditCardControls.forEach(controlName => {
        this.checkoutFormGroup.get(`payment.${controlName}`)?.updateValueAndValidity();
      });
    }
  }

  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(totalQuantity => this.totalQuantity = totalQuantity);
    this.cartService.totalPrice.subscribe(totalPrice => this.totalPrice = totalPrice);
  }

  // // HÀM MỚI: ĐƯỢC GỌI KHI NGƯỜI DÙNG CHỌN PHƯƠNG THỨC THANH TOÁN
  // onPaymentMethodChange(event: Event): void {
  //   const target = event.target as HTMLInputElement;
  //   this.selectedPaymentMethod = target.value;
  // }

  onSubmit() {
    console.log("Handling the submit button");

    // Kiểm tra nếu form không hợp lệ
    if (this.checkoutFormGroup.invalid) {
      // Chạm vào tất cả các trường để hiển thị lỗi
      this.checkoutFormGroup.markAllAsTouched();
      console.log("Form is invalid. Aborting submission.");
      return;
    }

    // Nếu form hợp lệ, tiếp tục xử lý
    console.log("Form is valid. Processing data...");

    // Lấy thông tin khách hàng và địa chỉ giao hàng
    const customerInfo = this.checkoutFormGroup.get('customer')?.value;
    const shippingInfo = this.checkoutFormGroup.get('shippingAddress')?.value;

    // Lấy thông tin thanh toán
    const paymentInfo = this.checkoutFormGroup.get('payment')?.value;

    // Log toàn bộ thông tin ra console để kiểm tra
    console.log("--- Customer Info ---");
    console.log(customerInfo);

    console.log("--- Shipping Info ---");
    console.log(shippingInfo);

    console.log("--- Payment Info ---");
    console.log(`Payment Method: ${paymentInfo.paymentMethod}`);

    // Chỉ hiển thị thông tin thẻ nếu phương thức là 'creditCard'
    if (paymentInfo.paymentMethod === 'creditCard') {
      const creditCardDetails = {
        nameOnCard: paymentInfo.nameOnCard,
        cardNumber: paymentInfo.cardNumber,
        expiration: `${paymentInfo.expirationMonth}/${paymentInfo.expirationYear}`,
        // Lưu ý: Không bao giờ log hoặc lưu CVV trong môi trường production!
        // securityCode: paymentInfo.securityCode 
      };
      console.log("Credit Card Details:", creditCardDetails);
    }

    // =================================================================
    // BƯỚC TIẾP THEO: TẠI ĐÂY BẠN SẼ GỌI SERVICE ĐỂ GỬI DỮ LIỆU NÀY LÊN SERVER
    // Ví dụ: this.checkoutService.placeOrder(orderData).subscribe(...)
    // =================================================================
  }
}
// // Các hàm helper cho tháng/năm
// getCreditCardMonths(startMonth: number) {
//   let data: number[] = [];
//   for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
//     data.push(theMonth);
//   }
//   this.creditCardMonths = data;
// }

// getCreditCardYears() {
//   let data: number[] = [];
//   const startYear: number = new Date().getFullYear();
//   const endYear: number = startYear + 10;
//   for (let theYear = startYear; theYear <= endYear; theYear++) {
//     data.push(theYear);
//   }
//   this.creditCardYears = data;
// }