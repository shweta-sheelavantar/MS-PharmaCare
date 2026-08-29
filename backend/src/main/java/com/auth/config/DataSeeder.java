package com.auth.config;

import com.auth.entity.Category;
import com.auth.entity.Product;
import com.auth.repository.CategoryRepository;
import com.auth.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.JdbcTemplate;
import java.nio.file.Files;
import java.nio.file.Paths;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            System.out.println("Seeding database with default categories...");
            Category meds = categoryRepository.save(new Category(null, "Prescription Medicines"));
            Category otc = categoryRepository.save(new Category(null, "OTC Supplements"));
            Category devices = categoryRepository.save(new Category(null, "Medical Devices"));
            Category baby = categoryRepository.save(new Category(null, "Baby Care"));
            Category cosmetics = categoryRepository.save(new Category(null, "Derma Cosmetics"));
            Category ayurveda = categoryRepository.save(new Category(null, "Ayurveda"));
        }

    }
}

