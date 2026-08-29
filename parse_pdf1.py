import re

text = open('d:\\registerPage\\all_pdfs.txt', 'r', encoding='utf-8').read()
pdf1_text = text.split('===')[2]

lines = pdf1_text.strip().split('\n')
start_idx = 0
for i, line in enumerate(lines):
    if 'Price' in line:
        start_idx = i + 1
        break

products = []
i = start_idx
while i < len(lines):
    line = lines[i].strip()
    if not line:
        i += 1
        continue
    if line.startswith('Produc'):
        i += 1
        continue
    if line in ('t ID', 'Product Name', 'Image URL', 'Description') or line.startswith('Price'):
        i += 1
        continue
        
    if re.match(r'^\d+$', line):
        product_id = int(line)
        name = lines[i+1].strip()
        
        j = i + 2
        url_parts = []
        while j < len(lines) and (lines[j].startswith('http') or (not lines[j].startswith('http') and not ' ' in lines[j])):
            if ' ' in lines[j] and not lines[j].startswith('http'):
                break
            url_parts.append(lines[j].strip())
            j += 1
        
        url = ''.join(url_parts)
        description = lines[j].strip()
        
        k = j + 1
        desc_parts = [description]
        while k < len(lines) and not re.match(r'^\d+\.\d+$', lines[k].strip()):
            desc_parts.append(lines[k].strip())
            k += 1
            
        description = ' '.join(desc_parts)
        price = float(lines[k].strip())
        
        products.append({
            'id': product_id,
            'name': name,
            'url': url,
            'description': description,
            'price': price
        })
        i = k + 1
    else:
        i += 1

import json

# Set category_id for all products
for p in products:
    p['category_id'] = 1
    p['image'] = p.pop('url')
    p['stock'] = 100

with open('d:\\registerPage\\pdf1_import.json', 'w', encoding='utf-8') as out:
    json.dump(products, out, indent=2)

print(f'Saved {len(products)} products to pdf1_import.json')
