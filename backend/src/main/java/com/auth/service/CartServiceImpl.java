package com.auth.service;

import com.auth.dto.*;
import com.auth.entity.CartItem;
import com.auth.entity.Product;
import com.auth.entity.User;
import com.auth.exception.CartItemNotFoundException;
import com.auth.exception.ProductNotFoundException;
import com.auth.exception.StockExceededException;
import com.auth.repository.CartItemRepository;
import com.auth.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CartMapper cartMapper;

    public CartServiceImpl(CartItemRepository cartItemRepository, ProductRepository productRepository, CartMapper cartMapper) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.cartMapper = cartMapper;
    }

    @Override
    @Transactional
    public CartCountResponse addToCart(User user, AddToCartRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ProductNotFoundException("Product Not Found"));

        if (product.getStock() <= 0) {
            throw new StockExceededException("Product Out of Stock");
        }

        Optional<CartItem> existingItemOpt = cartItemRepository.findByUserAndProduct(user, product);
        int qtyToAdd = (request.getQuantity() != null && request.getQuantity() > 0) ? request.getQuantity() : 1;

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            if (existingItem.getQuantity() + qtyToAdd > product.getStock()) {
                throw new StockExceededException("Stock Limit Exceeded");
            }
            existingItem.setQuantity(existingItem.getQuantity() + qtyToAdd);
            cartItemRepository.save(existingItem);
        } else {
            if (qtyToAdd > product.getStock()) {
                throw new StockExceededException("Stock Limit Exceeded");
            }
            CartItem newItem = new CartItem();
            newItem.setUser(user);
            newItem.setProduct(product);
            newItem.setQuantity(qtyToAdd);
            cartItemRepository.save(newItem);
        }

        return getCartCount(user);
    }

    @Override
    public CartCountResponse getCartCount(User user) {
        Integer totalItems = cartItemRepository.sumQuantityByUser(user);
        return new CartCountResponse(totalItems != null ? totalItems : 0);
    }

    @Override
    public CartResponse getCartItems(User user) {
        List<CartItem> items = cartItemRepository.findByUser(user);
        
        List<CartItemResponse> productResponses = items.stream()
                .map(cartMapper::toDto)
                .collect(Collectors.toList());

        double overallTotal = productResponses.stream()
                .mapToDouble(CartItemResponse::getTotalPrice)
                .sum();

        CartResponse.CartDetails cartDetails = new CartResponse.CartDetails();
        cartDetails.setOverallTotalPrice(overallTotal);
        cartDetails.setProducts(productResponses);

        CartResponse response = new CartResponse();
        response.setRole(user.getRole());
        response.setUsername(user.getUserName() != null ? user.getUserName() : user.getEmail());
        response.setCart(cartDetails);

        return response;
    }

    @Override
    @Transactional
    public CartResponse updateQuantity(User user, UpdateCartRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ProductNotFoundException("Product Not Found"));

        CartItem item = cartItemRepository.findByUserAndProduct(user, product)
                .orElseThrow(() -> new CartItemNotFoundException("Product is not in the cart"));

        if ("INCREMENT".equalsIgnoreCase(request.getOperation())) {
            if (item.getQuantity() + 1 > product.getStock()) {
                throw new StockExceededException("Stock Limit Exceeded");
            }
            item.setQuantity(item.getQuantity() + 1);
            cartItemRepository.save(item);
        } else if ("DECREMENT".equalsIgnoreCase(request.getOperation())) {
            if (item.getQuantity() - 1 <= 0) {
                cartItemRepository.delete(item);
            } else {
                item.setQuantity(item.getQuantity() - 1);
                cartItemRepository.save(item);
            }
        } else {
            throw new IllegalArgumentException("Invalid operation. Use INCREMENT or DECREMENT.");
        }

        return getCartItems(user);
    }

    @Override
    @Transactional
    public void removeProduct(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product Not Found"));

        if (!cartItemRepository.existsByUserAndProduct(user, product)) {
            throw new CartItemNotFoundException("Product is not in the cart");
        }

        cartItemRepository.deleteByUserAndProduct(user, product);
    }

    @Override
    @Transactional
    public void removeProducts(User user, List<Long> productIds) {
        for (Long productId : productIds) {
            Product product = productRepository.findById(productId).orElse(null);
            if (product != null && cartItemRepository.existsByUserAndProduct(user, product)) {
                cartItemRepository.deleteByUserAndProduct(user, product);
            }
        }
    }

    @Override
    @Transactional
    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }
}
