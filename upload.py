import json
import requests
import sys

def main():
    try:
        with open('output_prod.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print("Could not read output_prod.json:", e)
        sys.exit(1)

    print(f"Loaded {len(data)} products from JSON.")

    payload = []
    for item in data:
        cat_id = None
        if "category" in item and item["category"] and "id" in item["category"]:
            cat_id = item["category"]["id"]
        
        if not cat_id:
            continue

        prod = {
            "name": item.get("name"),
            "category_id": cat_id,
            "description": item.get("description"),
            "price": item.get("price"),
            "stock": item.get("stock"),
            "image": item.get("image")
        }
        if "id" in item:
            prod["id"] = item["id"]

        payload.append(prod)

    url = 'https://ms-pharmacare.onrender.com/api/import/bulk'
    batch_size = 5
    for i in range(0, len(payload), batch_size):
        batch = payload[i:i+batch_size]
        print(f"Sending batch {i//batch_size + 1} ({len(batch)} products)...")
        try:
            response = requests.post(url, json=batch, timeout=120)
            print(f"Batch {i//batch_size + 1} status: {response.status_code}")
        except Exception as e:
            print(f"Batch {i//batch_size + 1} failed:", e)

if __name__ == '__main__':
    main()
