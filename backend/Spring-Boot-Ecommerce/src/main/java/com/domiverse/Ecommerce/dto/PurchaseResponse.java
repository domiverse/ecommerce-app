package com.domiverse.Ecommerce.dto;

import lombok.Data;

@Data
public class PurchaseResponse extends Purchase{
    private String orderTrackingNumber;
}
