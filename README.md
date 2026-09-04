# Emdadul Hoque Emon — Initial Visual Construction + Graphic Design + Thumbnail Archives

A zero-dependency, static portfolio prototype with the initial visual system, sixteen supplied Graphic Design images, five supplied Thumbnail Design images, and the first populated Video archive.

## Run locally

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

Then open `http://localhost:4173`.

## Publishing Bangla Namelipi artwork

1. Drop the supplied image files (`JPG`, `JPEG`, `PNG`, or `WebP`) into the repository root or into an `uploads/` folder.
2. Run `python3 build_bangla_namelipi.py`.

The script moves them into `assets/bangla-namelipi/` and rewrites `data/bangla-namelipi.js`, assigning the entries to `window.banglaNamelipiArchive`. Titles are derived from the supplied filenames and are flagged `titleSupplied: false`; nothing else is inferred. Pass `--rebuild` to regenerate the data file without moving anything.

## Included in this phase

- Global header with a single circular EH profile avatar
- Figma-style high-contrast visual system with crisp white canvas, dark charcoal contrast, and orange accent
- Hamburger side drawer with route-aware active states
- Curated home page
- Fath Makkah flagship case study with bilingual content, optimized covers, and local PDF download CTA
- Reusable category hubs
- Video facade with lazy external-link-ready modal behavior
- Project detail modal
- Islamic Corner
- Prompt Archive with placeholder filters and detail interaction
- About and Contact routes
- Responsive mobile layout
- Reduced-motion support and keyboard focus management
- Structured project data in `app.js` plus separate `data/graphic-design.json` / `data/graphic-design.js` and `data/videos.json` / `data/videos.js` archives
- Sixteen optimized Graphic Design images from the validation pass and Batches 1–3 in `assets/graphic-design/`
- Five optimized Thumbnail Design images in `assets/thumbnails/`
- Twenty-two self-hosted YouTube poster frames in `assets/video-posters/`
- Dedicated Bangla Namelipi route (`#/bangla-namelipi`) rendering the `id="bangla-namelipi"` section, populated from `data/bangla-namelipi.js` (`window.banglaNamelipiArchive`)
- `build_bangla_namelipi.py`, which moves supplied Bangla Namelipi images into `assets/bangla-namelipi/` and regenerates that data file
- Google Fonts (Aladin, Inter, Noto Sans Bengali, Amiri) loaded via `<link>` tags in `index.html`

Typography usage hooks are ready for future content:

```html
<span class="arabic-text" lang="ar" dir="rtl">…</span>
<span class="bengali-text" lang="bn">…</span>
```

The supplied Graphic Design and Video records retain empty fields where no metadata was provided. No client, award, statistic, testimonial, availability statement, project outcome, credit, summary, or alt-text claim has been fabricated. Remaining explicit placeholders can be replaced during the next content batch.

See `PHASE-2B-UPLOAD-CHECKLIST.md` for the exact image and video metadata format.
