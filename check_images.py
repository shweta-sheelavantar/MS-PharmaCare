import json
import requests

def check_images():
    with open('images_to_check.json', 'r') as f:
        images = json.load(f)
        
    broken_products = set()
    category_counts = {}
    broken_details = []
    
    print(f"Checking {len(images)} image URLs...")
    for img in images:
        cat_id = img['category_id']
        category_counts[cat_id] = category_counts.get(cat_id, 0) + 1
        
        url = img['image_url']
        try:
            # Add user-agent to avoid simple blocks
            headers = {'User-Agent': 'Mozilla/5.0'}
            resp = requests.head(url, headers=headers, timeout=5)
            if resp.status_code >= 400:
                print(f"Broken URL ({resp.status_code}): {url} for product {img['name']}")
                broken_products.add(img['product_id'])
                broken_details.append(img)
        except Exception as e:
            print(f"Error for {url}: {e}")
            broken_products.add(img['product_id'])
            broken_details.append(img)
            
    print(f"\nFound {len(broken_products)} products with broken images.")
    if len(broken_products) > 0:
        print("Products to be deleted (broken images):")
        for bd in broken_details:
            print(f"- Product ID: {bd['product_id']}, Name: {bd['name']}, Category: {bd['category_id']}")
            
if __name__ == '__main__':
    check_images()
