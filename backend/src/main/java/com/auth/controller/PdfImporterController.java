package com.auth.controller;

import com.auth.entity.Category;
import com.auth.entity.Product;
import com.auth.repository.CategoryRepository;
import com.auth.repository.ProductRepository;
import com.auth.repository.ProductImageRepository;
import com.auth.entity.ProductImage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/import")
public class PdfImporterController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @PostMapping("/pdf1")
    public String importPdf1() {
        try {
            Category category = categoryRepository.findById(2L).orElseThrow(() -> new RuntimeException("Category not found"));
            
            Object[][] products = {
                {61L, "Ensure Nutrition Powder 400g", "Complete balanced nutrition supplement", 18.99, 100, "https://ik.imagekit.io/ShwetaStringstack/Ensure%20Nutrition%20Powder%20400g.webp"},
                {62L, "Horlicks Classic 500g", "Malt-based health drink", 7.99, 100, "https://ik.imagekit.io/ShwetaStringstack/Horlicks%20Classic%20500g.webp"},
                {63L, "Protinex Original 400g", "High-protein nutrition powder", 11.99, 100, "https://ik.imagekit.io/ShwetaStringstack/Protinex%20Original%20400g.webp"},
                {64L, "Pediasure Vanilla 400g", "Nutrition supplement for children", 22.99, 100, "https://ik.imagekit.io/ShwetaStringstack/Pediasure%20Vanilla%20400g.webp"},
                {65L, "B-Protin Chocolate", "Protein powder with vitamins", 10.49, 100, "https://ik.imagekit.io/ShwetaStringstack/B-Protin%20Chocolate.webp"},
                {66L, "Himalaya Ashwagandha", "Herbal energy supplement", 6.99, 100, "https://ik.imagekit.io/ShwetaStringstack/Himalaya%20Ashwagandha.webp"},
                {67L, "Revital H Capsules", "Multivitamin and Ginseng capsules", 5.49, 100, "https://ik.imagekit.io/ShwetaStringstack/Revital%20H%20Capsules.webp"},
                {68L, "Zincovit Tablets", "Multivitamin and mineral tablets", 4.99, 100, "https://ik.imagekit.io/ShwetaStringstack/Revital%20H%20Capsules.webp"},
                {69L, "Shelcal 500 Tablets", "Calcium and Vitamin D3 supplement", 3.99, 100, "https://ik.imagekit.io/ShwetaStringstack/Shelcal%20500%20Tablets.jpg"},
                {70L, "Supradyn Daily Tablets", "Daily multivitamin tablets", 4.49, 100, "https://ik.imagekit.io/ShwetaStringstack/Supradyn%20Daily%20Tablets.webp"},
                {71L, "Vitamin C 500mg Tablets", "Immunity support supplement", 5.99, 100, "https://ik.imagekit.io/ShwetaStringstack/Vitamin%20C%20500mg%20Tablet.webp"},
                {72L, "Omega-3 Fish Oil Capsules", "Supports heart and brain health", 12.99, 100, "https://ik.imagekit.io/ShwetaStringstack/Omega-3%20Fish%20Oil%20Capsules.webp"},
                {73L, "Vitamin D3 Capsules", "Supports bone health", 7.49, 100, "https://ik.imagekit.io/ShwetaStringstack/Vitamin%20D3%20Capsules.webp"},
                {74L, "Iron Plus Tablets", "Iron and folic acid supplement", 4.99, 100, "https://ik.imagekit.io/ShwetaStringstack/Iron%20Plus%20Tablets''.png"},
                {75L, "Biotin Hair Gummies", "Supports healthy hair and nails", 14.99, 100, "https://ik.imagekit.io/ShwetaStringstack/Biotin%20Hair%20Gummies.webp"},
                {76L, "Collagen Powder", "Supports skin and joints", 24.99, 100, "https://ik.imagekit.io/ShwetaStringstack/Collagen%20Powder.webp"},
                {77L, "Whey Protein Vanilla", "High-quality protein supplement", 44.99, 100, "https://ik.imagekit.io/ShwetaStringstack/Whey%20Protein%20Vanilla.webp"},
                {78L, "Electrolyte Powder", "Hydration and energy support", 8.99, 100, "https://ik.imagekit.io/ShwetaStringstack/Electrolyte%20Powder.webp"},
                {79L, "Herbal Immunity Booster", "Natural immunity supplement", 9.99, 100, "https://ik.imagekit.io/ShwetaStringstack/Herbal%20Immunity%20Booster.jpg"},
                {80L, "Protein Energy Bars Pack", "High-protein nutrition bars", 13.99, 100, "https://ik.imagekit.io/ShwetaStringstack/Protein%20Energy%20Bars%20Pack.webp"},
                {81L, "Centrum Multivitamin Tablets", "Complete daily multivitamin supplement", 15.99, 100, "https://ik.imagekit.io/ShwetaStringstack/Centrum%20Multivitamin%20Tablets.webp"},
                {82L, "Neurobion Forte Tablets", "Vitamin B complex for nerve health", 6.99, 100, "https://ik.imagekit.io/ShwetaStringstack/Neurobion%20Forte%20Tablets.webp"},
                {83L, "Limcee Vitamin C Tablets", "Chewable Vitamin C for immunity", 4.99, 100, "https://ik.imagekit.io/ShwetaStringstack/Limcee%20Vitamin%20C%20Tablets.webp"},
                {84L, "Becosules Capsules", "Vitamin B-complex supplement", 5.49, 100, "https://ik.imagekit.io/ShwetaStringstack/Becosules%20Capsules.webp"},
                {85L, "Calcimax Tablets", "Calcium, Magnesium and Vitamin D3 supplement", 8.99, 100, "https://ik.imagekit.io/ShwetaStringstack/Calcimax%20Tablets.avif"},
                {86L, "HealthKart Multivitamin Tablets", "Daily nutritional support tablets", 12.99, 100, "https://ik.imagekit.io/ShwetaStringstack/HealthKart%20Multivitamin%20Tablets.avif"},
                {87L, "Evion 400 Capsules", "Vitamin E antioxidant supplement", 7.49, 100, "https://ik.imagekit.io/ShwetaStringstack/Evion%20400%20Capsules.avif"},
                {88L, "A to Z NS Tablets", "Multivitamin and multimineral supplement", 9.49, 100, "https://ik.imagekit.io/ShwetaStringstack/A%20to%20Z%20NS%20Tablets.webp"},
                {89L, "Livogen Tablets", "Iron and folic acid supplement", 5.99, 100, "https://ik.imagekit.io/ShwetaStringstack/Livogen%20Tablets.webp"},
                {90L, "Dolo Vitamin D3 Tablets", "Vitamin D3 supplement for bone health", 6.49, 100, "https://ik.imagekit.io/ShwetaStringstack/Dolo%20Vitamin%20D3%20Tablets.jpg"}
            };
            
            for (Object[] row : products) {
                Long id = (Long) row[0];
                String name = (String) row[1];
                String description = (String) row[2];
                Double price = (Double) row[3];
                Integer stock = (Integer) row[4];
                String image = (String) row[5];
                
                Product p = productRepository.findById(id).orElse(new Product());
                p.setProductId(id);
                p.setName(name);
                p.setDescription(description);
                p.setPrice(price);
                p.setStock(stock);
                p.setCategory(category);
                p = productRepository.save(p);
                if (image != null && !image.isEmpty()) {
                    productImageRepository.save(new ProductImage(null, p, image));
                }
            }
            return "Success!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    @PostMapping("/bulk")
    public String importBulk(@RequestBody java.util.List<java.util.Map<String, Object>> productsData) {
        try {
            for (java.util.Map<String, Object> data : productsData) {
                String name = (String) data.get("name");
                Long categoryId = Long.valueOf(data.get("category_id").toString());
                Category category = categoryRepository.findById(categoryId).orElseThrow();

                Product p = null;
                if (data.containsKey("id") && data.get("id") != null) {
                    Long id = Long.valueOf(data.get("id").toString());
                    p = productRepository.findById(id).orElse(null);
                }
                if (p == null && name != null) {
                    p = productRepository.findByName(name).orElse(null);
                }

                if (p == null) {
                    p = new Product();
                    p.setName(name);
                }
                
                if (data.containsKey("description")) p.setDescription((String) data.get("description"));
                if (data.containsKey("price")) p.setPrice(Double.valueOf(data.get("price").toString()));
                if (data.containsKey("stock")) p.setStock(Integer.valueOf(data.get("stock").toString()));
                p.setCategory(category);
                p = productRepository.save(p);

                if (data.containsKey("image")) {
                    String imgUrl = (String) data.get("image");
                    if (imgUrl != null && !imgUrl.isEmpty()) {
                        productImageRepository.save(new ProductImage(null, p, imgUrl));
                    }
                }
            }
            return "Success!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}
