package com.auth.controller;

import com.auth.entity.Category;
import com.auth.entity.Product;
import com.auth.dto.ProductDTO;
import com.auth.dto.CategoryDTO;
import com.auth.repository.CategoryRepository;
import com.auth.repository.ProductRepository;
import com.auth.repository.ReviewRepository;
import com.auth.entity.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class PublicEcommerceController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        List<Product> allProducts = productRepository.findAll();

        Map<Long, List<Product>> productsByCat = allProducts.stream()
                .filter(p -> p.getCategory() != null && p.getCategory().getCategoryId() != null)
                .collect(Collectors.groupingBy(p -> p.getCategory().getCategoryId()));

        List<CategoryDTO> dtos = categories.stream().map(c -> {
            List<Product> products = productsByCat.getOrDefault(c.getCategoryId(), Collections.emptyList());
            int count = products.size();
            String imageUrl = "";
            if (count > 0 && products.get(0).getImages() != null && !products.get(0).getImages().isEmpty()) {
                imageUrl = products.get(0).getImages().get(0).getImageUrl();
            }
            String catName = c.getCategoryName() != null ? c.getCategoryName().toLowerCase() : "";
            if (catName.contains("ayurveda") || catName.contains("ayurvedic")) {
                imageUrl = "https://ik.imagekit.io/ShwetaStringstack/products/ayurvedic.webp";
            } else if (catName.contains("baby care")) {
                imageUrl = "https://ik.imagekit.io/ShwetaStringstack/products/babyCareProduct.jpg";
            } else if (catName.contains("derma cosmetics") || catName.contains("dermo")) {
                imageUrl = "https://ik.imagekit.io/ShwetaStringstack/products/dermoproduct.webp";
            } else if (catName.contains("prescription")) {
                imageUrl = "https://ik.imagekit.io/ShwetaStringstack/products/prescription%20products.jpg";
            } else if (catName.contains("nutrition") || catName.contains("health supplement")) {
                imageUrl = "https://ik.imagekit.io/ShwetaStringstack/products/Nutrition%20&%20Health%20supliments.jpeg";
            } else if (catName.contains("medical devices")) {
                imageUrl = "https://ik.imagekit.io/ShwetaStringstack/products/Medical%20Devices.jpg";
            }
            String slug = c.getCategoryName() != null ? c.getCategoryName().toLowerCase().replace(" ", "-") : "";
            String desc = "Explore our wide range of " + (c.getCategoryName() != null ? c.getCategoryName() : "") + " products.";
            return new CategoryDTO(c.getCategoryId(), c.getCategoryName(), slug, imageUrl, desc, count);
        }).toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductDTO>> getAllProducts(@RequestParam(required = false) String search) {
        List<Product> products;
        if (search != null && !search.trim().isEmpty()) {
            products = productRepository.findByNameContainingIgnoreCase(search.trim());
        } else {
            products = productRepository.findAll();
        }

        List<Review> allReviews = reviewRepository.findAll();
        Map<Long, List<Review>> reviewsByProduct = allReviews.stream()
                .filter(r -> r.getProduct() != null && r.getProduct().getProductId() != null)
                .collect(Collectors.groupingBy(r -> r.getProduct().getProductId()));

        return ResponseEntity.ok(products.stream().map(p -> convertToDTO(p, reviewsByProduct.getOrDefault(p.getProductId(), Collections.emptyList()))).toList());
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        List<Review> reviews = reviewRepository.findByProductProductId(id);
        return productRepository.findById(id)
                .map(p -> convertToDTO(p, reviews))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/products/category/{categoryId}")
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable Long categoryId) {
        List<Product> products = productRepository.findByCategoryCategoryId(categoryId);
        List<Review> allReviews = reviewRepository.findAll();
        Map<Long, List<Review>> reviewsByProduct = allReviews.stream()
                .filter(r -> r.getProduct() != null && r.getProduct().getProductId() != null)
                .collect(Collectors.groupingBy(r -> r.getProduct().getProductId()));

        return ResponseEntity.ok(products.stream().map(p -> convertToDTO(p, reviewsByProduct.getOrDefault(p.getProductId(), Collections.emptyList()))).toList());
    }

    private ProductDTO convertToDTO(Product product, List<Review> reviews) {
        CategoryDTO categoryDTO = null;
        if (product.getCategory() != null) {
            Category c = product.getCategory();
            String slug = c.getCategoryName() != null ? c.getCategoryName().toLowerCase().replace(" ", "-") : "";
            categoryDTO = new CategoryDTO(c.getCategoryId(), c.getCategoryName(), slug, null, null, null);
        }

        String imageUrl = null;
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            imageUrl = product.getImages().get(0).getImageUrl();
        }
        
        Double averageRating = 0.0;
        Integer reviewCount = reviews != null ? reviews.size() : 0;
        
        if (reviewCount > 0) {
            averageRating = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
            averageRating = Math.round(averageRating * 10.0) / 10.0;
        }

        return new ProductDTO(
                product.getProductId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                categoryDTO,
                imageUrl,
                averageRating,
                reviewCount
        );
    }
}
