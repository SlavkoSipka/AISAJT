"""Remove white/light background from PNG. Makes corner-connected light pixels transparent."""
from PIL import Image
import sys

def remove_background(input_path, output_path, threshold=250):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    w, h = img.size
    
    # Build list of (r,g,b,a) and mark pixels to make transparent
    pixels = list(data)
    
    def idx(x, y):
        return y * w + x
    
    def is_light(i):
        r, g, b, a = pixels[i]
        if a == 0:
            return False
        return r >= threshold and g >= threshold and b >= threshold
    
    # Flood-fill from all 4 corners: light pixels connected to edge become transparent
    visited = set()
    stack = []
    for x in range(w):
        stack.append((x, 0))
        stack.append((x, h - 1))
    for y in range(h):
        stack.append((0, y))
        stack.append((w - 1, y))
    
    while stack:
        x, y = stack.pop()
        if x < 0 or x >= w or y < 0 or y >= h:
            continue
        i = idx(x, y)
        if i in visited:
            continue
        visited.add(i)
        r, g, b, a = pixels[i]
        if a == 0:
            continue
        if r >= threshold and g >= threshold and b >= threshold:
            pixels[i] = (r, g, b, 0)
            for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
                stack.append((x + dx, y + dy))
    
    img.putdata(pixels)
    img.save(output_path, "PNG")
    print(f"Saved: {output_path}")

if __name__ == "__main__":
    input_path = sys.argv[1] if len(sys.argv) > 1 else "public/images/aisajt providno.png"
    output_path = sys.argv[2] if len(sys.argv) > 2 else "public/images/aisajt-logo-transparent.png"
    remove_background(input_path, output_path)
