import json

text = open('d:\\registerPage\\all_pdfs.txt', 'r', encoding='utf-8').read()
pdf_text = text.split('===')[10]
lines = pdf_text.strip().split('\n')

products = []
for i in range(0, len(lines), 2):
    if not lines[i].strip():
        continue
    if len(lines) <= i+1:
        break
        
    name_line = lines[i].strip()
    url_line = lines[i+1].strip()
    
    # Remove prefix "1: " or "12:"
    if ':' in name_line:
        name = name_line.split(':', 1)[1].strip()
    else:
        name = name_line
        
    # Remove trailing ".jpg", ".webp" etc from name
    name = name.replace('.jpg', '').replace('.webp', '').replace('.png', '').strip('.')
    
    products.append({
        'name': name,
        'description': f"{name} - Medical Equipment",
        'price': 100.0,
        'stock': 100,
        'image': url_line,
        'category_id': 3
    })

with open('d:\\registerPage\\pdf5.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2)

print(f"Parsed {len(products)} products from PDF 5")
