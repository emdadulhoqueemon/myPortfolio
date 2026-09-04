# Font sources

All typography is now served from the Google Fonts API via `<link>` tags in `index.html`.
No font binaries are stored in this repository.

- Aladin — display headings and titles. https://fonts.google.com/specimen/Aladin (SIL Open Font License 1.1)
- Inter — UI, body, and small text. https://fonts.google.com/specimen/Inter (SIL Open Font License 1.1)
- Noto Sans Bengali — Bengali content (`lang="bn"`, `.bengali-text`). https://fonts.google.com/noto/specimen/Noto+Sans+Bengali (SIL Open Font License 1.1)
- Amiri — Arabic content, Quran and Hadith (`lang="ar"`, `.arabic-text`). https://fonts.google.com/specimen/Amiri (SIL Open Font License 1.1)

The previously self-hosted faces (Monotes, Saprona, Kohinur Bangla, Aref Ruqaa) and the
`fonts/` directory were removed; they are no longer referenced by any stylesheet.
