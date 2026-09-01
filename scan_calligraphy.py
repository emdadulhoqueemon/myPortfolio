import os
import glob
import json

images = []
for ext in ('*.jpg', '*.jpeg', '*.png', '*.webp'):
    images.extend(glob.glob(ext))
    images.extend(glob.glob(os.path.join('uploads', ext)))

os.makedirs('assets/arabic-calligraphy', exist_ok=True)
os.makedirs('data', exist_ok=True)

projects = []
for idx, img in enumerate(images):
    filename = os.path.basename(img)
    new_path = f"assets/arabic-calligraphy/{filename}"
    os.rename(img, new_path)
    
    # Clean filename for title
    base_name = os.path.splitext(filename)[0]
    clean_title = base_name.replace('-', ' ').replace('_', ' ').title()
    
    projects.append({
        "slug": f"arabic-calligraphy-{idx+1}",
        "title": clean_title,
        "label": "Arabic Calligraphy",
        "visual": "archive",
        "categories": ["islamic-corner", "calligraphy"],
        "status": "Published",
        "imageSrc": new_path
    })

if projects:
    js_content = "window.arabicCalligraphyArchive = " + json.dumps(projects, indent=2, ensure_ascii=False) + ";"
    with open("data/arabic-calligraphy.js", "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"Success! Organized {len(projects)} Arabic Calligraphy images.")
else:
    print("No images found. Please upload them first.")
