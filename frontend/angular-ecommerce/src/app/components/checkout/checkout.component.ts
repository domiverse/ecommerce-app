import { CartItem } from './../../common/cart-item';
import { CheckoutService } from './../../services/checkout.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CheckoutFormService } from '../../services/checkout-form.service';
import { VietnameseAddressService } from '../../services/vietnamese-address.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { DomiverseValidators } from '../../validators/domiverse-validators';
import { Address } from '../../common/address';
import { AuthService } from '../../services/auth.service';
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
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];

  selectedPaymentMethod: string = '';

  vietQRUrl: string = ''; // THÊM DÒNG NÀY: Để lưu URL của ảnh QR
  // THÊM: Thông tin tài khoản của bạn
  // THÊM MỚI: Hằng số tỷ giá (bạn có thể thay đổi giá trị này)
  private readonly EXCHANGE_RATE_USD_TO_VND = 25000;
  private readonly BANK_ID = '970423'; // BIN/ID của TPBank
  private readonly ACCOUNT_NO = '00003502576'; // Số tài khoản của bạn


  // SỬA: Inject checkoutFormService
  constructor(private formBuilder: FormBuilder,
    private cartService: CartService,
    private checkoutFormService: CheckoutFormService,
    private addressService: VietnameseAddressService,
    private checkoutService: CheckoutService,
    private router: Router,
    private authService: AuthService, 
  ) { } // Inject service

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), DomiverseValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), DomiverseValidators.notOnlyWhitespace]),
        companyName: [''],
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
        ]),
        phone: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]{10,11}$')
        ])
      }),
      shippingAddress: this.formBuilder.group({
        province: new FormControl('', [Validators.required]),
        district: new FormControl('', [Validators.required]),
        ward: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required, Validators.minLength(5), DomiverseValidators.notOnlyWhitespace]),
        orderNotes: ['']
      }),
      payment: this.formBuilder.group({
        paymentMethod: new FormControl('', [Validators.required]),
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), DomiverseValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{16}$')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3}$')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
      
    });

    // BƯỚC 2: Bắt đầu lấy dữ liệu cho giỏ hàng
    this.reviewCartDetails();

    this.checkoutFormService.getCreditCardYears().subscribe(
      (data: number[]) => {
        this.creditCardYears = data;
      }
    );

    this.addressService.getProvinces().subscribe((data: any[]) => {
      this.provinces = data;
    });

    this.setupAddressDropdownsLogic();

    // SỬA LẠI TÊN HÀM GỌI Ở ĐÂY
    this.handleCreditCardMonthsAndYears();
    
    // THÊM MỚI: Lấy thông tin người dùng hiện tại nếu đã đăng nhập
      this.authService.currentUser.subscribe(user => {
      if (user) {
        console.log("User is logged in. Pre-filling form.");
        this.checkoutFormGroup.get('customer')?.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
      }
    });
  
  }

  setupAddressDropdownsLogic() {
    // Lắng nghe thay đổi của dropdown Tỉnh/Thành
    this.shippingProvince?.valueChanges.subscribe((provinceCode: number) => {
      this.districts = [];
      this.wards = [];
      this.shippingDistrict?.setValue('');
      this.shippingWard?.setValue('');

      if (provinceCode) {
        this.addressService.getDistricts(provinceCode).subscribe((data: any[]) => {
          // THÊM DÒNG LOG NÀY ĐỂ DEBUG
          console.log('Received districts:', data);
          this.districts = data;
        });
      }
    });

    // Lắng nghe thay đổi của dropdown Quận/Huyện
    this.shippingDistrict?.valueChanges.subscribe((districtCode: number) => {
      this.wards = [];
      this.shippingWard?.setValue('');

      if (districtCode) {
        this.addressService.getWards(districtCode).subscribe((data: any[]) => {
          // THÊM DÒNG LOG NÀY ĐỂ DEBUG
          console.log('Received wards:', data);
          this.wards = data;
        });
      }
    });
  }

  // THÊM MỚI: Hàm xử lý logic chính
  handleCreditCardMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('payment');

    // Lắng nghe sự kiện thay đổi của ô chọn NĂM
    creditCardFormGroup?.get('expirationYear')?.valueChanges.subscribe(
      yearString => {
        const selectedYear = Number(yearString);
        const currentYear = new Date().getFullYear();
        let startMonth: number;

        if (selectedYear === currentYear) {
          // Nếu là năm hiện tại, tháng bắt đầu là tháng hiện tại
          startMonth = new Date().getMonth() + 1;
        } else {
          // Nếu là các năm trong tương lai, tháng bắt đầu là 1
          startMonth = 1;
        }

        this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
          (data: number[]) => {
            this.creditCardMonths = data;
          }
        );
      }
    );

    // LẤY DỮ LIỆU THÁNG CHO LẦN ĐẦU TIÊN
    // Khi component vừa tải, chúng ta sẽ mặc định lấy các tháng của năm hiện tại
    const initialStartMonth = new Date().getMonth() + 1;
    this.checkoutFormService.getCreditCardMonths(initialStartMonth).subscribe(
      (data: number[]) => {
        console.log("Retrieved initial credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  // THÊM MỚI: Các hàm Getter để truy cập form controls
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }
  get phone() { return this.checkoutFormGroup.get('customer.phone'); }

  get shippingProvince() { return this.checkoutFormGroup.get('shippingAddress.province'); }
  get shippingDistrict() { return this.checkoutFormGroup.get('shippingAddress.district'); }
  get shippingWard() { return this.checkoutFormGroup.get('shippingAddress.ward'); }
  get shippingStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }

  get paymentMethod() { return this.checkoutFormGroup.get('payment.paymentMethod'); }
  get nameOnCard() { return this.checkoutFormGroup.get('payment.nameOnCard'); }
  get cardNumber() { return this.checkoutFormGroup.get('payment.cardNumber'); }
  get securityCode() { return this.checkoutFormGroup.get('payment.securityCode'); }
  get cardType() { return this.checkoutFormGroup.get('payment.cardType'); }

  // SỬA: Cập nhật hàm này để set validator khi chọn phương thức thanh toán
  onPaymentMethodChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedPaymentMethod = target.value;

    const paymentGroup = this.checkoutFormGroup.get('payment');
    const creditCardControls = ['cardType', 'nameOnCard', 'cardNumber', 'securityCode', 'expirationMonth', 'expirationYear'];

    if (this.selectedPaymentMethod === 'creditCard') {
      // Bắt buộc nhập các trường credit card
      paymentGroup?.get('cardType')?.setValidators([Validators.required]);
      paymentGroup?.get('nameOnCard')?.setValidators([Validators.required, Validators.minLength(2), DomiverseValidators.notOnlyWhitespace]);
      paymentGroup?.get('cardNumber')?.setValidators([Validators.required, Validators.pattern('^[0-9]{16}$')]);
      paymentGroup?.get('securityCode')?.setValidators([Validators.required, Validators.pattern('^[0-9]{3}$')]);
      // Có thể thêm validator cho expirationMonth, expirationYear nếu muốn
    } else {
      // Không bắt buộc nhập các trường credit card
      creditCardControls.forEach(controlName => {
        paymentGroup?.get(controlName)?.clearValidators();
        paymentGroup?.get(controlName)?.setValue('');
        paymentGroup?.get(controlName)?.updateValueAndValidity();
      });
    }

    // Nếu chọn bankTransfer hoặc cash, không cần validator gì thêm
    paymentGroup?.get('paymentMethod')?.setValidators([Validators.required]);
    paymentGroup?.get('paymentMethod')?.updateValueAndValidity();
  }

  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    this.cartService.totalPrice.subscribe(
      totalPrice => {
        this.totalPrice = totalPrice;
        // THÊM DÒNG NÀY: Gọi hàm tạo QR mỗi khi tổng tiền thay đổi
        this.generateVietQRUrl(this.totalPrice);
      }
    );
  }


  onSubmit() {
    console.log("Handling the submit button");

    // Kiểm tra nếu form không hợp lệ
    if (this.checkoutFormGroup.invalid) {
      // Chạm vào tất cả các trường để hiển thị lỗi
      this.checkoutFormGroup.markAllAsTouched();
      console.log("Form is invalid. Aborting submission.");
      return;
    }

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    // - long way
    /*
    let orderItems: OrderItem[] = [];
    for (let i=0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    */

    // - short way of doing the same thingy
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    const shippingAddressData = this.checkoutFormGroup.controls['shippingAddress'].value;
    const formattedShippingAddress = new Address(
      shippingAddressData.street,
      // Ghép tỉnh, huyện, xã thành một chuỗi cho trường city
      `${shippingAddressData.province}, ${shippingAddressData.district}, ${shippingAddressData.ward}`
    );
    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

        // reset cart
        this.resetCart();

      },
      error: err => {
        alert(`There was an error: ${err.message}`);
      }
    }
    );

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

    //Đảm bảo rằng người dùng không thể gửi đi đơn hàng nếu form còn lỗi
    console.log("Handling the submit button");

    if (this.checkoutFormGroup.invalid) {
      // Dòng này sẽ kích hoạt việc hiển thị tất cả các lỗi của form
      this.checkoutFormGroup.markAllAsTouched();
      return; // Dừng lại, không xử lý tiếp
    }
  }


  generateVietQRUrl(amountInUSD: number) {
    // Bước 1: Chuyển đổi từ USD sang VND và làm tròn thành số nguyên
    const amountInVND = Math.round(amountInUSD * this.EXCHANGE_RATE_USD_TO_VND);

    // Bước 2: Chỉ tạo URL nếu số tiền lớn hơn hoặc bằng 0
    if (amountInVND >= 0) {
      const description = "Thanh toan don hang Domiverse";

      // Bước 3: Sử dụng biến amountInVND (đã đổi sang VND) để tạo URL
      const url = `https://api.vietqr.io/image/970423-00003502576-print.png?amount=${amountInVND}&addInfo=${encodeURIComponent(description)}`;

      this.vietQRUrl = url;
      console.log(`Generated VietQR URL for ${amountInVND} VND:`, this.vietQRUrl);
    }
  }

  // Thêm hàm resetCart để xử lý việc reset giỏ hàng và form
  resetCart() {
    // Đặt lại giỏ hàng
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // Đặt lại form
    this.checkoutFormGroup.reset();

    // Chuyển hướng về trang sản phẩm hoặc trang chủ
    this.router.navigateByUrl("/products");
  }
}
