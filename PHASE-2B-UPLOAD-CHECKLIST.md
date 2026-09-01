# Phase 2B upload checklist

Use this checklist for the first real Graphic Design project and the first real Video project. The current site is still using placeholders; these two records will validate the content model before the full archive is populated.

## 1. Graphic Design project

### Required

- One project title
- One cover image
- The category or categories to use

### Image recommendation

- Preferred formats: `JPG` or `WebP`
- Use `PNG` only when transparency or very crisp flat artwork is important
- Maximum upload size: **8 MB per image**
- Preferred resolution: **up to 2400 px on the longest edge**
- Preferred color profile: **sRGB**
- For this validation, send one cover image; optional gallery images can be sent afterward
- Optional working/source files such as `PDF`, `PSD`, or `AI` may be provided separately, but they will not be used as the web image by default
- Avoid `HEIC`, screenshots of the artwork, or images that require a login to view

Recommended filenames:

```text
graphic-project-cover.jpg
graphic-project-detail-01.jpg
graphic-project-detail-02.png
```

### Optional project fields

Only include fields you want published. Nothing will be inferred:

```text
summary: short factual description
role: what you personally did
format: poster / graphic / social visual / etc.
year: only if you want it shown
credits: only if applicable
source: only if applicable
altText: a useful description of the image
```

The site can optimize the supplied image into responsive WebP/AVIF versions later. Keep the original supplied file as the source asset.

## 2. Video project metadata

The first video does not need to be uploaded as a large video file. Send the public video URL and the metadata below. A watch-page URL is preferred over an embed-code snippet.

### Exact JSON format

```json
{
  "slug": "short-form-video-01",
  "title": "Your exact project title",
  "videoUrl": "https://example.com/your-video",
  "platform": "YouTube",
  "videoType": "short-form",
  "aspectRatio": "9:16",
  "summary": "Optional short factual description.",
  "role": "Optional description of your contribution.",
  "duration": "00:00",
  "posterImage": "video-poster.jpg",
  "captionsUrl": "https://example.com/captions.vtt",
  "credits": "Optional credits.",
  "featured": false
}
```

### Required video fields

- `title`
- `videoUrl`
- `platform`
- `videoType`
- `aspectRatio`

### Optional video fields

- `slug` — useful for the permanent project URL
- `summary`
- `role`
- `duration`
- `posterImage`
- `captionsUrl`
- `credits`
- `featured`

### Accepted video values

`platform` can be one of:

```text
YouTube
Vimeo
Google Drive
Direct MP4
Other
```

`videoType` can be one of:

```text
short-form
reel
social video
motion study
editorial video
other
```

`aspectRatio` should be one of:

```text
9:16
1:1
4:5
16:9
other
```

### Video link requirements

- The link should be publicly viewable without a login if it is expected to embed
- If embedding is not allowed, say `external-only`; the site will show a facade with a direct watch link instead
- For Google Drive, set the sharing permission to anyone with the link if you want it to be viewable
- If supplying a poster image, use the same image limits as the Graphic Design checklist: JPG/WebP/PNG, maximum 8 MB, preferably up to 2400 px on the longest edge
- Do not include private client links or confidential metadata
- Only provide claims, roles, credits, dates, or outcomes you want published

## Send next

For the validation pass, send:

1. One real Graphic Design cover image, plus the title and any optional metadata
2. One real Video project using the JSON structure above
3. A poster image for the video only if you have one
