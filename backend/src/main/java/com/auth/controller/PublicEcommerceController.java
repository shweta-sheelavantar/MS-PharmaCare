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

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
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
        List<CategoryDTO> dtos = categories.stream().map(c -> {
            List<Product> products = productRepository.findByCategoryCategoryId(c.getCategoryId());
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
            String slug = c.getCategoryName().toLowerCase().replace(" ", "-");
            String desc = "Explore our wide range of " + c.getCategoryName() + " products.";
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
        return ResponseEntity.ok(products.stream().map(this::convertToDTO).toList());
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/products/category/{categoryId}")
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable Long categoryId) {
        List<Product> products = productRepository.findByCategoryCategoryId(categoryId);
        return ResponseEntity.ok(products.stream().map(this::convertToDTO).toList());
    }

    private ProductDTO convertToDTO(Product product) {
        CategoryDTO categoryDTO = null;
        if (product.getCategory() != null) {
            Category c = product.getCategory();
            String slug = c.getCategoryName().toLowerCase().replace(" ", "-");
            categoryDTO = new CategoryDTO(c.getCategoryId(), c.getCategoryName(), slug, null, null, null);
        }

        String imageUrl = null;
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            imageUrl = product.getImages().get(0).getImageUrl();
        }
        
        List<Review> reviews = reviewRepository.findByProductProductId(product.getProductId());
        Double averageRating = 0.0;
        Integer reviewCount = reviews.size();
        
        if (reviewCount > 0) {
            averageRating = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
            // round to 1 decimal place
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
