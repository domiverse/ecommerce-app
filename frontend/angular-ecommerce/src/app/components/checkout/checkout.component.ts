import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CheckoutFormService } from '../../services/checkout-form.service';
import { DomiverseValidators } from '../../validators/domiverse-validators';
import { VietnameseAddressService } from '../../services/vietnamese-address.service';
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
  private readonly EXCHANGE_RATE_USD_TO_VND = 100; 
  private readonly BANK_ID = '970423'; // BIN/ID của TPBank
  private readonly ACCOUNT_NO = '00003502576'; // Số tài khoản của bạn


  // SỬA: Inject checkoutFormService
  constructor(private formBuilder: FormBuilder,
    private cartService: CartService,
    private checkoutFormService: CheckoutFormService,
    private addressService: VietnameseAddressService
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
}
