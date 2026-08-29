from PIL import Image

# Load the image
img = Image.open('D:/registerPage/frontend/public/Gemini_Generated_Image_s2mmcts2mmcts2mm.png')

width, height = img.size
cx, cy = width // 2, height // 2
# The logo has some text at the bottom.
# Let's crop a box of width 1000 and height 1000
crop_w, crop_h = 1000, 1000
left = cx - crop_w // 2
upper = cy - crop_h // 2
right = cx + crop_w // 2
lower = cy + crop_h // 2

cropped = img.crop((left, upper, right, lower))
cropped.save('D:/registerPage/frontend/public/logo_cropped.png')
print("Manually cropped logo saved!")
