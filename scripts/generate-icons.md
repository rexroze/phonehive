# Generate PWA Icons

## Quick Method: Use Online Tool

1. Visit https://www.pwabuilder.com/imageGenerator
2. Upload a square image (512x512 or larger)
3. Download the generated icons
4. Place `icon-192x192.png` and `icon-512x512.png` in the `public` folder

## Alternative: Create Simple Placeholder Icons

If you need quick placeholder icons, you can:

1. Use any image editor (Photoshop, GIMP, Canva, etc.)
2. Create a square canvas:
   - 192x192 pixels → Save as `icon-192x192.png`
   - 512x512 pixels → Save as `icon-512x512.png`
3. Use a solid color or simple logo
4. Place both files in the `public` folder

## Using ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
# Create a simple colored square icon
convert -size 192x192 xc:#000000 public/icon-192x192.png
convert -size 512x512 xc:#000000 public/icon-512x512.png
```

Replace `#000000` with your brand color.

## Using Node.js Script (Alternative)

You can also create a simple script to generate placeholder icons, but for now, using an online tool is the easiest method.

