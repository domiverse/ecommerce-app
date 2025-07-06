package com.domiverse.Ecommerce.dto;

import lombok.Data;

@Data
public class PurchaseResponse extends Purchase{
    private final String orderTrackingNumber;
}
