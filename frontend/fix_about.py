import re

filepath = r'd:\registerPage\frontend\src\pages\AboutPage.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace colors
content = content.replace('sky-600', 'emerald-500')
content = content.replace('sky-700', 'emerald-600')
content = content.replace('sky-50', 'emerald-50')
content = content.replace('sky-100', 'emerald-100')
content = content.replace('sky-500', 'emerald-400')
content = content.replace('sky-800', 'emerald-700')
content = content.replace('sky-900', 'emerald-900')

# Increase section padding for better gaps
content = content.replace('py-20', 'py-28')
content = content.replace('py-16', 'py-24')

# Make hero section taller for more breathing room
content = content.replace('h-[400px] md:h-[500px]', 'h-[500px] md:h-[600px]')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated AboutPage.jsx successfully.")
