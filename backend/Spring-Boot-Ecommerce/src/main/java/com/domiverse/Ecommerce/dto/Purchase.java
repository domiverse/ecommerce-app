package com.domiverse.Ecommerce.dto;

import com.domiverse.Ecommerce.entity.Address;
import com.domiverse.Ecommerce.entity.Customer;
import com.domiverse.Ecommerce.entity.Order;
import com.domiverse.Ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
