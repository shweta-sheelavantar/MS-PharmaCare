import mysql.connector

# Database connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Shweta@26",
    database="auth_db"
)

cursor = db.cursor(dictionary=True)

try:
    print("Fetching images from category 6 products...")
    cursor.execute("SELECT image FROM products WHERE category_id = 6 LIMIT 6")
    products = cursor.fetchall()
    
    if len(products) >= 6:
        print("Updating category images...")
        for i in range(1, 7):
            img_url = products[i-1]['image']
            cursor.execute("UPDATE categories SET image = %s WHERE category_id = %s", (img_url, i))
        db.commit()
        print("Category images updated successfully!")
    else:
        print("Not enough products to get images from!")

    print("Fetching all products from category 6...")
    cursor.execute("SELECT name, description, price, original_price, stock, image, prescription, rating, reviews, manufacturer FROM products WHERE category_id = 6")
    cat6_products = cursor.fetchall()

    print(f"Found {len(cat6_products)} products. Duplicating into categories 1 to 5...")
    
    insert_query = """
        INSERT INTO products (name, description, price, original_price, stock, image, prescription, rating, reviews, manufacturer, category_id, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
    """
    
    # Empty existing products for categories 1-5 just to be safe and avoid extreme duplication
    cursor.execute("DELETE FROM products WHERE category_id IN (1,2,3,4,5)")
    
    for category_id in range(1, 6):
        print(f"Inserting into category {category_id}...")
        for p in cat6_products:
            values = (
                p['name'], p['description'], p['price'], p['original_price'], p['stock'], 
                p['image'], p['prescription'], p['rating'], p['reviews'], p['manufacturer'], 
                category_id
            )
            cursor.execute(insert_query, values)
            
    db.commit()
    print("Done! Categories 1-5 now have products.")
    
except Exception as e:
    print(f"Error: {e}")
    db.rollback()
finally:
    cursor.close()
    db.close()
