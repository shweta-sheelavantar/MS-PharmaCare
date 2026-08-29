import sys, re, json

pdf_index = int(sys.argv[1])
category_id = int(sys.argv[2])
out_file = sys.argv[3]

text = open('d:\\registerPage\\all_pdfs.txt', 'r', encoding='utf-8').read()
# pdf indexes in split are: 2 (PDF1), 4 (PDF2), 6 (PDF3), 8 (PDF4), 10 (PDF5)
pdf_text = text.split('===')[pdf_index * 2]

lines = pdf_text.strip().split('\n')
start_idx = 0
for i, line in enumerate(lines):
    if 'Image URL' in line or 'Price' in line:
        start_idx = i + 1

products = []
i = start_idx
while i < len(lines):
    line = lines[i].strip()
    if not line:
        i += 1
        continue
    if line in ('Product Name', 'Description', 'Price', 'Stock', 'Image URL') or 'Produc' in line or 't ID' in line:
        i += 1
        continue
        
    name = line
    j = i + 1
    
    desc_parts = []
    # while we don't hit a price
    while j < len(lines):
        clean_line = lines[j].strip().replace('$','').replace('■','')
        if re.match(r'^\d+(\.\d+)?$', clean_line):
            break
        desc_parts.append(lines[j].strip())
        j += 1
        
    if j >= len(lines):
        break
        
    description = ' '.join(desc_parts)
    price_str = lines[j].strip().replace('$','').replace('■','')
    try:
        price = float(price_str)
    except:
        price = 100.0 # fallback
    
    k = j + 1
    stock_str = lines[k].strip() if k < len(lines) else ""
    if re.match(r'^\d+$', stock_str):
        stock = int(stock_str)
        l = k + 1
    else:
        stock = 100
        l = k
        
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
        'category_id': category_id
    })
    i = l

with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2)

print(f'Parsed {len(products)} products into {out_file}')
