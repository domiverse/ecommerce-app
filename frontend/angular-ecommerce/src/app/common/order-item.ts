import { CartItem } from './cart-item';
import { Order } from './order';
export class OrderItem {

    imageUrl: string = '';
    unitPrice: number = 0; 
    quantity: number = 0;
    productId: number = 0;

    constructor(CartItem: CartItem) {
        this.imageUrl = CartItem.imageUrl;
        this.unitPrice = CartItem.unitPrice;
        this.quantity = CartItem.quantity;
        this.productId = CartItem.id;
    }
}
