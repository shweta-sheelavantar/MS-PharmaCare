package com.auth.controller;

import com.auth.entity.Address;
import com.auth.entity.User;
import com.auth.repository.AddressRepository;
import com.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.auth.exception.UnauthorizedException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AddressController {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new UnauthorizedException("Unauthorized");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UnauthorizedException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<Address>> getUserAddresses() {
        try {
            User user = getAuthenticatedUser();
            return ResponseEntity.ok(addressRepository.findByUserOrderByIsDefaultDesc(user));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping
    public ResponseEntity<Address> addAddress(@RequestBody Address address) {
        User user = getAuthenticatedUser();
        address.setUser(user);
        
        // If it's the first address or set as default, handle defaults
        List<Address> existing = addressRepository.findByUser(user);
        if (existing.isEmpty() || (address.getIsDefault() != null && address.getIsDefault())) {
            address.setIsDefault(true);
            for (Address a : existing) {
                a.setIsDefault(false);
                addressRepository.save(a);
            }
        } else {
            address.setIsDefault(false);
        }
        
        return ResponseEntity.ok(addressRepository.save(address));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(@PathVariable Long id, @RequestBody Address updatedAddress) {
        User user = getAuthenticatedUser();
        Optional<Address> existingOpt = addressRepository.findById(id);
        
        if (existingOpt.isPresent() && existingOpt.get().getUser().getId().equals(user.getId())) {
            Address existing = existingOpt.get();
            existing.setFullName(updatedAddress.getFullName());
            existing.setMobileNumber(updatedAddress.getMobileNumber());
            existing.setPinCode(updatedAddress.getPinCode());
            existing.setHouseNo(updatedAddress.getHouseNo());
            existing.setAreaStreet(updatedAddress.getAreaStreet());
            existing.setLandmark(updatedAddress.getLandmark());
            existing.setCity(updatedAddress.getCity());
            existing.setState(updatedAddress.getState());
            existing.setAddressType(updatedAddress.getAddressType());
            
            if (updatedAddress.getIsDefault() != null && updatedAddress.getIsDefault()) {
                List<Address> allAddresses = addressRepository.findByUser(user);
                for (Address a : allAddresses) {
                    a.setIsDefault(false);
                    addressRepository.save(a);
                }
                existing.setIsDefault(true);
            }
            
            return ResponseEntity.ok(addressRepository.save(existing));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        Optional<Address> existingOpt = addressRepository.findById(id);
        
        if (existingOpt.isPresent() && existingOpt.get().getUser().getId().equals(user.getId())) {
            addressRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
