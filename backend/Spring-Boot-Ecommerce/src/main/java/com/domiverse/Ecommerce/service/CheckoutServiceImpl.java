package com.domiverse.Ecommerce.service;

import com.domiverse.Ecommerce.dao.CustomerRepository;
import com.domiverse.Ecommerce.dto.Purchase;
import com.domiverse.Ecommerce.dto.PurchaseResponse;
import com.domiverse.Ecommerce.entity.Customer;
import com.domiverse.Ecommerce.entity.Order;
import com.domiverse.Ecommerce.entity.OrderItem;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;

public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public PurchaseResponse placeOrder(Purchase purchase) {

        //retrieve the order ìnformation from dto
        Order order = purchase.getOrder();

        //generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        //populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        //populate order with billing and shipping address
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());
        //populate customer with order
        Customer customer = purchase.getCustomer();
        customer.add(order);

        //save to the database
        customerRepository.save(customer);

        //return a response with the tracking number
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {

        // Generate a random UUID for the order tracking number
        return java.util.UUID.randomUUID().toString();

    }
}