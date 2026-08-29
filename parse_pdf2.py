import re
import json
import urllib.request

text = open('d:\\registerPage\\all_pdfs.txt', 'r', encoding='utf-8').read()
pdf_text = text.split('===')[4]

lines = pdf_text.strip().split('\n')
start_idx = 0
for i, line in enumerate(lines):
    if 'Image URL' in line:
        start_idx = i + 1
        break

products = []
i = start_idx
while i < len(lines):
    line = lines[i].strip()
    if not line:
        i += 1
        continue
    if line in ('Product Name', 'Description', 'Price', 'Stock', 'Image URL'):
        i += 1
        continue
        
    name = line
    j = i + 1
    
    desc_parts = []
    # next lines are description until we hit a price (number)
    while j < len(lines) and not re.match(r'^\d+(\.\d+)?$', lines[j].strip()):
        desc_parts.append(lines[j].strip())
        j += 1
        
    description = ' '.join(desc_parts)
    price = float(lines[j].strip())
    
    # stock should be next
    k = j + 1
    stock = int(lines[k].strip())
    
    # image url can span multiple lines until next name (or end of file)
    l = k + 1
    url_parts = []
    while l < len(lines) and (lines[l].startswith('http') or not ' ' in lines[l]):
        url_parts.append(lines[l].strip())
        l += 1
        
    url = ''.join(url_parts)
    
    products.append({
        'name': name,
        'description': description,
        'price': price,
        'stock': stock,
        'image': url,
        'category_id': 4
    })
    
    i = l

print(f"Parsed {len(products)} products from PDF 2")

with open('d:\\registerPage\\pdf2.json', 'w') as f:
    json.dump(products, f, indent=2)
try:
    with urllib.request.urlopen(req) as response:
        print("API Response:", response.read().decode('utf-8'))
except Exception as e:
    print("API Error:", e)

