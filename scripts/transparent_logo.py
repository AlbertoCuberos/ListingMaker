from PIL import Image

def process_image(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    
    gray = img.convert('L')
    
    def map_alpha(v):
        if v < 15: return 0
        return min(255, int((v - 15) * (255.0 / 240.0)))
        
    alpha = gray.point(map_alpha)
    img.putalpha(alpha)
    
    img.save(output_path, "PNG")

process_image("assets/logo-hd.png", "assets/logo-transparent.png")
process_image("assets/logo-hd.png", "public/logo.png")
process_image("assets/logo-hd.png", "public/logo-large.png")
print("Logos procesados a PNG transparente.")
