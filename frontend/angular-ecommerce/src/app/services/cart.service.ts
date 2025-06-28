import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  // Sử dụng BehaviorSubject để có thể lấy giá trị cuối cùng ngay khi đăng ký
 totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);


  constructor() { }

  addToCart(theCartItem: CartItem) {

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;

    if (this.cartItems.length > 0) {
      // Tìm sản phẩm trong giỏ hàng dựa trên id
      existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id );

      // Kiểm tra nếu chúng ta đã tìm thấy nó
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if (alreadyExistsInCart) {
      // Nếu đã có, tăng số lượng lên
      existingCartItem!.quantity++;
    }
    else {
      // Nếu chưa có, thêm sản phẩm vào mảng
      this.cartItems.push(theCartItem);
    }

    // Tính toán lại tổng giá tiền và tổng số lượng
    this.computeCartTotals();
  }

    // --- GIẢM SỐ LƯỢNG SẢN PHẨM ---
  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem); // Nếu số lượng về 0, xóa sản phẩm
    }
    else {
      this.computeCartTotals();
    }
  }

  //--- XÓA SẢN PHẨM KHỎI GIỎ ---
  remove(theCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartItem.id );

    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // "Phát sóng" các giá trị mới... tất cả các subscriber sẽ nhận được dữ liệu mới
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // Ghi log dữ liệu giỏ hàng để debug
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----');
  }
}
