import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-status',
  standalone: false,
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.css'
})
export class CartStatusComponent implements OnInit {

  totalPrice: number = 19.22;
  totalQuantity: number = 2;

  constructor() { }

  ngOnInit(): void {
  }
}