import os
from pdf2image import convert_from_path
from PIL import ImageDraw, Image

# 📁 Path to your folder of PDFs
pdf_folder = r'C:/Users/mrami/Desktop/DCIM/FloorPlans'
output_folder = r'C:/Users/mrami/Desktop/DCIM/FloorPlans/Converted'

# Grid config
grid_size = 50  # size of each grid cell in pixels
grid_color = "black"  # you can also use (0, 0, 0)
grid_width = 1  # line thickness

# Ensure output directory exists
os.makedirs(output_folder, exist_ok=True)

# Loop through PDF files
for filename in os.listdir(pdf_folder):
    if filename.lower().endswith('.pdf'):
        pdf_path = os.path.join(pdf_folder, filename)
        print(f'🔄 Converting: {filename}')

        try:
            images = convert_from_path(pdf_path)
        except Exception as e:
            print(f"❌ Failed to convert {filename}: {e}")
            continue

        for i, image in enumerate(images):
            draw = ImageDraw.Draw(image)
            width, height = image.size

            # Draw vertical lines
            for x in range(0, width, grid_size):
                draw.line([(x, 0), (x, height)], fill=grid_color, width=grid_width)

            # Draw horizontal lines
            for y in range(0, height, grid_size):
                draw.line([(0, y), (width, y)], fill=grid_color, width=grid_width)

            # Save image with grid
            image_filename = f"{os.path.splitext(filename)[0]}_page_{i+1}_grid.png"
            image.save(os.path.join(output_folder, image_filename), 'PNG')

print("✅ All PDFs converted and grid applied!")