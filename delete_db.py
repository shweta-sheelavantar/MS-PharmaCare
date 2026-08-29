import pymysql

connection = pymysql.connect(
    host='localhost',
    user='root',
    password='Shweta@26',
    database='auth_db',
    cursorclass=pymysql.cursors.DictCursor
)

with connection:
    with connection.cursor() as cursor:
        # Delete from productimages first due to foreign key constraints (if any)
        cursor.execute("DELETE FROM productimages WHERE product_id BETWEEN 1 AND 30")
        img_deleted = cursor.rowcount
        
        # Delete from products
        cursor.execute("DELETE FROM products WHERE product_id BETWEEN 1 AND 30")
        prod_deleted = cursor.rowcount
        
        connection.commit()
        print(f"Deleted {img_deleted} rows from productimages.")
        print(f"Deleted {prod_deleted} rows from products.")
        
        # Check counts
        cursor.execute("SELECT COUNT(*) as count FROM products WHERE category_id = 1")
        cat1_count = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM products WHERE category_id = 2")
        cat2_count = cursor.fetchone()['count']
        
        print(f"Category 1 (Prescription Medicines) count: {cat1_count}")
        print(f"Category 2 (OTC Supplements) count: {cat2_count}")
