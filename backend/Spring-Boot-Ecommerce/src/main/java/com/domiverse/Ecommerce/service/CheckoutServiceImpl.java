package com.domiverse.Ecommerce.service;

import com.domiverse.Ecommerce.dao.CustomerRepository;
import com.domiverse.Ecommerce.dto.Purchase;
import com.domiverse.Ecommerce.dto.PurchaseResponse;
import com.domiverse.Ecommerce.entity.Customer;
import com.domiverse.Ecommerce.entity.Order;
import com.domiverse.Ecommerce.entity.OrderItem;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        // 1. Lấy dữ liệu từ DTO và kiểm tra customer
        Customer customer = purchase.getCustomer();
        String theEmail = customer.getEmail();
        Optional<Customer> customerFromDB = customerRepository.findByEmail(theEmail);
        if (customerFromDB.isPresent()) {
            customer = customerFromDB.get();
        }

        // 2. Tạo đối tượng Order mới
        Order order = new Order();

        // 3. Gán các thông tin cơ bản cho Order
        order.setOrderTrackingNumber(generateOrderTrackingNumber());
        order.setStatus("IN_PROGRESS");
        order.setShippingAddress(purchase.getShippingAddress());
        order.setBillingAddress(purchase.getBillingAddress());

        // 4. Lấy các order items và thiết lập quan hệ
        Set<OrderItem> orderItems = purchase.getOrderItems();

        // ✨ **PHẦN SỬA LỖI QUAN TRỌNG** ✨
        // Kiểm tra nếu orderItems là null để tránh NullPointerException
        if (orderItems == null) {
            // Bạn có thể ném ra một ngoại lệ để báo lỗi rõ ràng hơn
            throw new IllegalArgumentException("Order items không được để trống.");
            // Hoặc khởi tạo một Set rỗng nếu logic nghiệp vụ cho phép
            // orderItems = new HashSet<>();
        }
        orderItems.forEach(order::add); // Gán order cho từng order item

        // 5. Tính toán lại tổng tiền và số lượng ở server để bảo mật
        BigDecimal calculatedPrice = BigDecimal.ZERO;
        int calculatedQuantity = 0;
        for (OrderItem item : orderItems) {
            calculatedPrice = calculatedPrice.add(item.getUnitPrice().multiply(new BigDecimal(item.getQuantity())));
            calculatedQuantity += item.getQuantity();
        }
        order.setTotalPrice(calculatedPrice);
        order.setTotalQuantity(calculatedQuantity);

        // 6. Thiết lập quan hệ giữa Customer và Order
        customer.add(order);

        // 7. Lưu Customer (sẽ tự động lưu Order và OrderItems nhờ CascadeType.ALL)
        customerRepository.save(customer);

        // 8. Trả về response
        return new PurchaseResponse(order.getOrderTrackingNumber());
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}