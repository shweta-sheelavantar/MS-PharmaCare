from PIL import Image

# Load the image
img = Image.open('D:/registerPage/frontend/public/newlogo.png')
img = img.convert("RGBA")

bbox = img.getbbox()
if bbox:
    cropped = img.crop(bbox)
    cropped.save('D:/registerPage/frontend/public/newlogo_cropped.png')
    print(f"Cropped to: {cropped.size}")
else:
    print("Could not find bounding box, maybe image is empty?")
