import mysql.connector

def main():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Shweta@26",
            database="auth_db"
        )
        cursor = conn.cursor(dictionary=True)

        print("--- DUPLICATE IMAGE URLS IN productimages TABLE ---")
        
        # We join productimages with products to get product names
        query = """
            SELECT pi.image_url, COUNT(DISTINCT pi.product_id) as product_count, 
                   GROUP_CONCAT(p.product_id) as pids,
                   GROUP_CONCAT(p.name SEPARATOR ' || ') as pnames
            FROM productimages pi
            JOIN products p ON pi.product_id = p.product_id
            GROUP BY pi.image_url
            HAVING product_count > 1
        """
        
        cursor.execute(query)
        img_duplicates = cursor.fetchall()
        if not img_duplicates:
            print("No duplicate image URLs found across different products.")
            
        for row in img_duplicates:
            print(f"URL: {row['image_url']}")
            print(f"Count: {row['product_count']}")
            print(f"Product IDs: {row['pids']}")
            print(f"Product Names: {row['pnames']}")
            print("-" * 40)
            
        
        print("\n--- BROKEN IMAGE CHECK PREPARATION ---")
        # Fetch all product images to check for 404s
        cursor.execute("SELECT pi.image_id, p.product_id, p.name, pi.image_url, p.category_id FROM productimages pi JOIN products p ON pi.product_id = p.product_id")
        all_images = cursor.fetchall()
        print(f"Found {len(all_images)} images to check.")
        
        # Dump to JSON for next script
        import json
        with open('images_to_check.json', 'w') as f:
            json.dump(all_images, f)
            
    except mysql.connector.Error as err:
        print(f"Error querying db: {err}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    main()
