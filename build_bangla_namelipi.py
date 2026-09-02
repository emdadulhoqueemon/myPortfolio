"""Move uploaded Bangla Namelipi images into assets/bangla-namelipi/ and
regenerate data/bangla-namelipi.js (window.banglaNamelipiArchive).

Usage:
    python3 build_bangla_namelipi.py            # move loose uploads, then rebuild data
    python3 build_bangla_namelipi.py --rebuild  # only rebuild data from assets/bangla-namelipi/

Any image dropped in the repository root or in uploads/ is treated as a supplied
Bangla Namelipi file and moved into assets/bangla-namelipi/. Files already inside
assets/bangla-namelipi/ are kept in place. Nothing is invented: titles are derived
from the supplied filenames and are flagged as not supplied.
"""

import json
import os
import re
import glob
import shutil
import sys
from urllib.parse import quote

IMAGE_GLOBS = ("*.jpg", "*.jpeg", "*.png", "*.webp")
DEST_DIR = os.path.join("assets", "bangla-namelipi")
DATA_FILE = os.path.join("data", "bangla-namelipi.js")
SOURCE_DIRS = (".", "uploads")


def natural_key(path):
    """Sort 'Namelipi 2.jpg' before 'Namelipi 10.jpg'."""
    stem = os.path.splitext(os.path.basename(path))[0]
    return [int(part) if part.isdigit() else part.lower() for part in re.split(r"(\d+)", stem)]


def collect_uploads():
    found = []
    for directory in SOURCE_DIRS:
        if not os.path.isdir(directory):
            continue
        for pattern in IMAGE_GLOBS:
            found.extend(glob.glob(os.path.join(directory, pattern)))
    # De-duplicate and keep a stable, human-readable order.
    return sorted(set(os.path.normpath(p) for p in found), key=natural_key)


def move_uploads():
    os.makedirs(DEST_DIR, exist_ok=True)
    moved = []
    for source in collect_uploads():
        target = os.path.join(DEST_DIR, os.path.basename(source))
        if os.path.abspath(source) == os.path.abspath(target):
            continue
        shutil.move(source, target)
        moved.append(target)
    return moved


def archive_images():
    images = []
    for pattern in IMAGE_GLOBS:
        images.extend(glob.glob(os.path.join(DEST_DIR, pattern)))
    return sorted(set(os.path.normpath(p) for p in images), key=natural_key)


def title_from_filename(filename):
    stem = os.path.splitext(os.path.basename(filename))[0]
    return stem.replace("-", " ").replace("_", " ").strip() or stem


def build_entries():
    entries = []
    for index, path in enumerate(archive_images(), start=1):
        filename = os.path.basename(path)
        src = quote(path.replace(os.sep, "/"), safe="/")
        entries.append({
            "slug": f"bangla-namelipi-{index:02d}",
            "sourceId": os.path.splitext(filename)[0],
            "sourceFilename": filename,
            "title": title_from_filename(filename),
            "language": "bn",
            "titleSupplied": False,
            "label": "Bangla Namelipi",
            "visual": "poster",
            "categories": ["calligraphy-namelipi"],
            "tags": ["Namelipi", "Bangla calligraphy"],
            "status": "Supplied image",
            "summary": "",
            "imageSrc": src,
            "imageAlt": "",
            "altTextSupplied": False,
            "featured": False,
        })
    return entries


def write_data(entries):
    os.makedirs("data", exist_ok=True)
    body = json.dumps(entries, indent=2, ensure_ascii=False)
    content = "window.banglaNamelipiArchive = " + body + ";\n"
    with open(DATA_FILE, "w", encoding="utf-8") as handle:
        handle.write(content)


def main():
    rebuild_only = "--rebuild" in sys.argv
    if not rebuild_only:
        moved = move_uploads()
        if moved:
            print(f"Moved {len(moved)} uploaded image(s) into {DEST_DIR}/")
        else:
            print(f"No loose uploads found in {', '.join(SOURCE_DIRS)}; nothing to move.")
    entries = build_entries()
    write_data(entries)
    print(f"Wrote {DATA_FILE} with {len(entries)} entr{'y' if len(entries) == 1 else 'ies'} "
          f"(window.banglaNamelipiArchive)")
    if not entries:
        print(f"No images in {DEST_DIR}/ yet. Add the supplied files there and re-run this script.")


if __name__ == "__main__":
    main()
