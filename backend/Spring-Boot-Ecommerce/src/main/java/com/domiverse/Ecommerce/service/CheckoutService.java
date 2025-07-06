package com.domiverse.Ecommerce.service;


import com.domiverse.Ecommerce.dto.Purchase;
import com.domiverse.Ecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}