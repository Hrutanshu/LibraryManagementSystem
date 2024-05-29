package com.hrg.library.Controller;

import com.hrg.library.RequestModels.ReviewRequest;
import com.hrg.library.service.ReviewService;
import com.hrg.library.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "https://localhost:3000")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/secure")
    public void postReview(@RequestHeader(value = "Authorization") String token, @RequestBody ReviewRequest reviewRequest) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        if(userEmail == null)
            throw new Exception("User email is missing");
        reviewService.postReview(userEmail, reviewRequest);
    }
    
    @GetMapping("secure/user/book")
    public boolean reviewBookByUSer(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        if(userEmail == null)
            throw new Exception("User email is missing");
        return reviewService.userReviewListed(userEmail, bookId);
    }
}
