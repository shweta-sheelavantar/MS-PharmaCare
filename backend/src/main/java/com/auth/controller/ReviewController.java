package com.auth.controller;

import com.auth.dto.ReviewDTO;
import com.auth.dto.ReviewRequest;
import com.auth.entity.Product;
import com.auth.entity.Review;
import com.auth.entity.User;
import com.auth.repository.ProductRepository;
import com.auth.repository.ReviewRepository;
import com.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{productId}/reviews")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<List<ReviewDTO>> getProductReviews(@PathVariable Long productId) {
        List<Review> reviews = reviewRepository.findByProductProductId(productId);
        
        List<ReviewDTO> dtos = reviews.stream()
                .sorted((r1, r2) -> {
                    if (r1.getCreatedAt() == null || r2.getCreatedAt() == null) return 0;
                    return r2.getCreatedAt().compareTo(r1.getCreatedAt());
                })
                .map(r -> new ReviewDTO(
                        r.getReviewId(),
                        r.getUser() != null ? r.getUser().getUserName() : "Anonymous",
                        r.getRating(),
                        r.getComment(),
                        r.getCreatedAt()
                )).toList();
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/{productId}/reviews")
    public ResponseEntity<?> addReview(@PathVariable Long productId, @RequestBody ReviewRequest reviewRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(401).build();
        }

        if (reviewRequest.getRating() == null || reviewRequest.getRating() < 1 || reviewRequest.getRating() > 5) {
            return ResponseEntity.badRequest().body("Rating must be between 1 and 5");
        }

        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(reviewRequest.getRating());
        review.setComment(reviewRequest.getComment());

        reviewRepository.save(review);
        return ResponseEntity.ok().build();
    }
}
