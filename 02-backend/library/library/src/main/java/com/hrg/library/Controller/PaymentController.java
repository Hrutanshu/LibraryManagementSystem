package com.hrg.library.Controller;

import com.hrg.library.RequestModels.PaymentInfoRequest;
import com.hrg.library.service.PaymentService;
import com.hrg.library.utils.ExtractJWT;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "https://localhost:3000")
@RestController
@RequestMapping("/api/payment/secure")
public class PaymentController {

    private PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/payment/intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfoRequest request) throws StripeException {
        PaymentIntent paymentIntent = paymentService.createPaymentIntent(request);
        String paymentString = paymentIntent.toJson();

        return new ResponseEntity<>(paymentString, HttpStatus.OK);
    }

    @PutMapping("/payment/complete")
    public ResponseEntity<String> paymentComplete(@RequestHeader(value = "Authorization") String token) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        if(userEmail == null)
            throw new Exception("User email is missing");
        return paymentService.stripePayment(userEmail);
    }
}
