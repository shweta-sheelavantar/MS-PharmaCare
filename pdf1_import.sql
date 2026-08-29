USE auth_db;

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (1, 'Ensure Nutrition Powder 400g', 'Complete balanced nutrition supplement', 18.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 1;
    INSERT INTO product_images (product_id, url) VALUES (1, 'https://ik.imagekit.io/ShwetaStringstack/Ensure%20Nutrition%20Powder%20400g.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (2, 'Horlicks Classic 500g', 'Malt-based health drink', 7.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 2;
    INSERT INTO product_images (product_id, url) VALUES (2, 'https://ik.imagekit.io/ShwetaStringstack/Horlicks%20Classic%20500g.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (3, 'Protinex Original 400g', 'High-protein nutrition powder', 11.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 3;
    INSERT INTO product_images (product_id, url) VALUES (3, 'https://ik.imagekit.io/ShwetaStringstack/Protinex%20Original%20400g.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (4, 'Pediasure Vanilla 400g', 'Nutrition supplement for children', 22.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 4;
    INSERT INTO product_images (product_id, url) VALUES (4, 'https://ik.imagekit.io/ShwetaStringstack/Pediasure%20Vanilla%20400g.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (5, 'B-Protin Chocolate', 'Protein powder with vitamins', 10.49, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 5;
    INSERT INTO product_images (product_id, url) VALUES (5, 'https://ik.imagekit.io/ShwetaStringstack/B-Protin%20Chocolate.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (6, 'Himalaya Ashwagandha', 'Herbal energy supplement', 6.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 6;
    INSERT INTO product_images (product_id, url) VALUES (6, 'https://ik.imagekit.io/ShwetaStringstack/Himalaya%20Ashwagandha.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (7, 'Revital H Capsules', 'Multivitamin and Ginseng capsules', 5.49, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 7;
    INSERT INTO product_images (product_id, url) VALUES (7, 'https://ik.imagekit.io/ShwetaStringstack/Revital%20H%20Capsules.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (8, 'Zincovit Tablets', 'Multivitamin and mineral tablets', 4.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 8;
    INSERT INTO product_images (product_id, url) VALUES (8, 'https://ik.imagekit.io/ShwetaStringstack/Revital%20H%20Capsules.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (9, 'Shelcal 500 Tablets', 'Calcium and Vitamin D3 supplement', 3.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 9;
    INSERT INTO product_images (product_id, url) VALUES (9, 'https://ik.imagekit.io/ShwetaStringstack/Shelcal%20500%20Tablets.jpg');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (10, 'Supradyn Daily Tablets', 'Daily multivitamin tablets', 4.49, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 10;
    INSERT INTO product_images (product_id, url) VALUES (10, 'https://ik.imagekit.io/ShwetaStringstack/Supradyn%20Daily%20Tablets.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (11, 'Vitamin C 500mg Tablets', 'Immunity support supplement', 5.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 11;
    INSERT INTO product_images (product_id, url) VALUES (11, 'https://ik.imagekit.io/ShwetaStringstack/Vitamin%20C%20500mg%20Tablet.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (12, 'Omega-3 Fish Oil Capsules', 'Supports heart and brain health', 12.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 12;
    INSERT INTO product_images (product_id, url) VALUES (12, 'https://ik.imagekit.io/ShwetaStringstack/Omega-3%20Fish%20Oil%20Capsules.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (13, 'Vitamin D3 Capsules', 'Supports bone health', 7.49, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 13;
    INSERT INTO product_images (product_id, url) VALUES (13, 'https://ik.imagekit.io/ShwetaStringstack/Vitamin%20D3%20Capsules.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (14, 'Iron Plus Tablets', 'Iron and folic acid supplement', 4.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 14;
    INSERT INTO product_images (product_id, url) VALUES (14, 'https://ik.imagekit.io/ShwetaStringstack/Iron%20Plus%20Tablets''.png');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (15, 'Biotin Hair Gummies', 'Supports healthy hair and nails', 14.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 15;
    INSERT INTO product_images (product_id, url) VALUES (15, 'https://ik.imagekit.io/ShwetaStringstack/Biotin%20Hair%20Gummies.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (16, 'Collagen Powder', 'Supports skin and joints', 24.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 16;
    INSERT INTO product_images (product_id, url) VALUES (16, 'https://ik.imagekit.io/ShwetaStringstack/Collagen%20Powder.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (17, 'Whey Protein Vanilla', 'High-quality protein supplement', 44.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 17;
    INSERT INTO product_images (product_id, url) VALUES (17, 'https://ik.imagekit.io/ShwetaStringstack/Whey%20Protein%20Vanilla.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (18, 'Electrolyte Powder', 'Hydration and energy support', 8.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 18;
    INSERT INTO product_images (product_id, url) VALUES (18, 'https://ik.imagekit.io/ShwetaStringstack/Electrolyte%20Powder.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (19, 'Herbal Immunity Booster', 'Natural immunity supplement', 9.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 19;
    INSERT INTO product_images (product_id, url) VALUES (19, 'https://ik.imagekit.io/ShwetaStringstack/Herbal%20Immunity%20Booster.jpg');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (20, 'Protein Energy Bars Pack', 'High-protein nutrition bars', 13.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 20;
    INSERT INTO product_images (product_id, url) VALUES (20, 'https://ik.imagekit.io/ShwetaStringstack/Protein%20Energy%20Bars%20Pack.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (21, 'Centrum Multivitamin Tablets', 'Complete daily multivitamin supplement', 15.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 21;
    INSERT INTO product_images (product_id, url) VALUES (21, 'https://ik.imagekit.io/ShwetaStringstack/Centrum%20Multivitamin%20Tablets.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (22, 'Neurobion Forte Tablets', 'Vitamin B complex for nerve health', 6.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 22;
    INSERT INTO product_images (product_id, url) VALUES (22, 'https://ik.imagekit.io/ShwetaStringstack/Neurobion%20Forte%20Tablets.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (23, 'Limcee Vitamin C Tablets', 'Chewable Vitamin C for immunity', 4.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 23;
    INSERT INTO product_images (product_id, url) VALUES (23, 'https://ik.imagekit.io/ShwetaStringstack/Limcee%20Vitamin%20C%20Tablets.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (24, 'Becosules Capsules', 'Vitamin B-complex supplement', 5.49, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 24;
    INSERT INTO product_images (product_id, url) VALUES (24, 'https://ik.imagekit.io/ShwetaStringstack/Becosules%20Capsules.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (25, 'Calcimax Tablets', 'Calcium, Magnesium and Vitamin D3 supplement', 8.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 25;
    INSERT INTO product_images (product_id, url) VALUES (25, 'https://ik.imagekit.io/ShwetaStringstack/Calcimax%20Tablets.avif');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (26, 'HealthKart Multivitamin Tablets', 'Daily nutritional support tablets', 12.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 26;
    INSERT INTO product_images (product_id, url) VALUES (26, 'https://ik.imagekit.io/ShwetaStringstack/HealthKart%20Multivitamin%20Tablets.avif');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (27, 'Evion 400 Capsules', 'Vitamin E antioxidant supplement', 7.49, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 27;
    INSERT INTO product_images (product_id, url) VALUES (27, 'https://ik.imagekit.io/ShwetaStringstack/Evion%20400%20Capsules.avif');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (28, 'A to Z NS Tablets', 'Multivitamin and multimineral supplement', 9.49, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 28;
    INSERT INTO product_images (product_id, url) VALUES (28, 'https://ik.imagekit.io/ShwetaStringstack/A%20to%20Z%20NS%20Tablets.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (29, 'Livogen Tablets', 'Iron and folic acid supplement', 5.99, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 29;
    INSERT INTO product_images (product_id, url) VALUES (29, 'https://ik.imagekit.io/ShwetaStringstack/Livogen%20Tablets.webp');
    

    INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) 
    VALUES (30, 'Dolo Vitamin D3 Tablets', 'Vitamin D3 supplement for bone health', 6.49, 100, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE 
        name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), category_id=VALUES(category_id), updated_at=NOW();
        
    DELETE FROM product_images WHERE product_id = 30;
    INSERT INTO product_images (product_id, url) VALUES (30, 'https://ik.imagekit.io/ShwetaStringstack/Dolo%20Vitamin%20D3%20Tablets.jpg');
    