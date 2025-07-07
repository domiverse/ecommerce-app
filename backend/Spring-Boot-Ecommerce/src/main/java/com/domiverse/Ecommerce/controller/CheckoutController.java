    package com.domiverse.Ecommerce.controller;


    import com.domiverse.Ecommerce.dto.Purchase;
    import com.domiverse.Ecommerce.dto.PurchaseResponse;
    import com.domiverse.Ecommerce.service.CheckoutService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.web.bind.annotation.*;

    @CrossOrigin(origins = "http://localhost:4200")
    @RestController
    @RequestMapping("/api/checkout")
    public class CheckoutController {
        private final CheckoutService checkoutService;

        @Autowired
        public CheckoutController(CheckoutService checkoutService) {
            this.checkoutService = checkoutService;
        }

        @PostMapping("/purchase")
        public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {

            PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);

            return  purchaseResponse;
        }
    }
