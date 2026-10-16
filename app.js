(() => {
  // Image download protection: block the context menu and drag-to-save on
  // images only. The previous handler blocked `contextmenu` on the whole
  // document, which also removed the long-press "Paste / Copy" menu from
  // inputs and textareas on mobile and stopped text from being selected.
  // Text-entry fields are now always allowed their native menu.
  const isTextEntry = (node) =>
    !!(node && node.closest && node.closest('input, textarea, select, [contenteditable="true"]'));

  document.addEventListener('contextmenu', (event) => {
    if (isTextEntry(event.target)) return;
    if (event.target && event.target.tagName === 'IMG') event.preventDefault();
  });
  document.addEventListener('dragstart', (event) => {
    if (event.target && event.target.tagName === 'IMG') event.preventDefault();
  });

  const app = document.getElementById('app');
  const modalRoot = document.getElementById('modal-root');
  const drawer = document.getElementById('site-drawer');
  const drawerToggle = document.querySelector('[data-open-drawer]');
  const drawerClose = document.querySelector('[data-close-drawer]');
  const bgToggle = document.getElementById('bg-toggle-btn') || document.querySelector('[data-bg-toggle]');
  const bgVideo = document.getElementById('bg-video');
  // Static Bangla Namelipi section (rendered by data/bangla-namelipi.js).
  const banglaSection = document.getElementById('bangla-namelipi');
  const banglaGrid = document.getElementById('bangla-namelipi-grid');
  const banglaCount = document.getElementById('bangla-namelipi-count');
  const banglaEmpty = document.getElementById('bangla-namelipi-empty');
  // Static Arabic Calligraphy section (rendered by data/arabic-calligraphy.js).
  const arabicSection = document.getElementById('arabic-calligraphy');
  const arabicGrid = document.getElementById('arabic-calligraphy-grid');
  const arabicCount = document.getElementById('arabic-calligraphy-count');
  const arabicEmpty = document.getElementById('arabic-calligraphy-empty');
  // ---- Play / Pause the background video --------------------------------
  // The header button physically controls the HTML5 <video> that paints the
  // page backdrop, instead of toggling a CSS animation class. The icon is
  // re-synced from the video's own `play`/`pause` events, so it stays honest
  // when autoplay is refused, when the browser pauses media in a background
  // tab, or when a reduced-motion preference starts the loop paused.
  const PLAY_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  const PAUSE_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

  function syncBgButton() {
    if (!bgToggle) return;
    const paused = !bgVideo || bgVideo.paused;
    bgToggle.innerHTML = paused ? PLAY_SVG : PAUSE_SVG;
    bgToggle.setAttribute('aria-pressed', String(paused));
    bgToggle.setAttribute('aria-label', paused ? 'Play background' : 'Pause background');
    bgToggle.setAttribute('title', paused ? 'Play background' : 'Pause background');
  }

  function toggleBg() {
    if (!bgVideo) return;
    if (bgVideo.paused) {
      // play() returns a promise that rejects if playback is refused (iOS Low
      // Power Mode, battery saver). Swallowing it keeps the console clean —
      // the play/pause events below put the button back in sync either way.
      const attempt = bgVideo.play();
      if (attempt && typeof attempt.catch === 'function') attempt.catch(() => syncBgButton());
    } else {
      bgVideo.pause();
    }
    syncBgButton();
  }

  if (bgVideo) {
    bgVideo.addEventListener('play', syncBgButton);
    bgVideo.addEventListener('pause', syncBgButton);
  }

  const state = {
    drawerOpen: false,
    modalOpen: false,
    drawerReturnFocus: null,
    modalReturnFocus: null
  };

  const categories = [
    {
      slug: 'graphic-design',
      index: '01',
      title: 'Graphic Design',
      label: 'Posters / Graphics',
      intro: 'A dedicated hub for poster and graphic design work. Initial content is represented by placeholders until supplied project material is added.',
      mark: 'Graphic\nDesign',
      tone: 'warm'
    },
    {
      slug: 'video-editing',
      index: '02',
      title: 'Video Editing',
      label: 'Short-form Video',
      intro: 'A dedicated hub for short-form video editing and related moving-image work, with a reusable external-link workflow.',
      mark: 'Video\nEditing',
      tone: 'quiet'
    },
    {
      slug: 'thumbnail-design',
      index: '03',
      title: 'Thumbnail Design',
      label: 'Thumbnail / Social',
      intro: 'A focused route for thumbnail design. Real examples, titles, and links will be added from supplied material.',
      mark: 'Thumbnail\nDesign',
      tone: 'gold'
    },
    {
      slug: 'motion-animation',
      index: '04',
      title: 'Motion & Animation',
      label: 'Motion / Animation',
      intro: 'A dedicated space for motion and animation studies, kept distinct from static graphic work while remaining cross-indexable.',
      mark: 'Motion &\nAnimation',
      tone: 'quiet'
    },
    {
      slug: 'social-media-design',
      index: '05',
      title: 'Social Media Design',
      label: 'Social / Content',
      intro: 'A category hub for social-media design and content visuals. The content model is ready for series-based additions.',
      mark: 'Social\nDesign',
      tone: 'warm'
    },
    {
      slug: 'calligraphy-namelipi',
      index: '06',
      title: 'Arabic Calligraphy',
      label: 'Arabic Calligraphy',
      intro: 'A dedicated route for calligraphy and Namelipi work, with captions and language information to be added per piece.',
      mark: 'Arabic\nCalligraphy',
      tone: 'gold'
    },
    {
      slug: 'editorial-storytelling',
      index: '07',
      title: 'Editorial / Visual Storytelling',
      label: 'Editorial / Narrative',
      intro: 'A space for work that uses image, type, sequence, and motion to build a visual story.',
      mark: 'Editorial\nStorytelling',
      tone: 'quiet'
    }
  ];

  const graphicDesignArchive = Array.isArray(window.graphicDesignArchive) ? window.graphicDesignArchive : [];
  const thumbnailArchive = Array.isArray(window.thumbnailArchive) ? window.thumbnailArchive : [];
  const videoArchive = Array.isArray(window.videoArchive) ? window.videoArchive : [];
  const banglaNamelipiArchive = Array.isArray(window.banglaNamelipiArchive) ? window.banglaNamelipiArchive : [];
  const arabicCalligraphyArchive = Array.isArray(window.arabicCalligraphyArchive) ? window.arabicCalligraphyArchive : [];
  const islamicCornerContent = window.islamicCornerContent && typeof window.islamicCornerContent === 'object' ? window.islamicCornerContent : {};
  const promptLibrary = Array.isArray(window.promptLibrary) ? window.promptLibrary : [];

  const baseProjects = [
    {
      slug: 'namelipi-placeholder',
      title: 'Calligraphy / Namelipi placeholder',
      label: 'Calligraphy / Namelipi',
      visual: 'archive',
      categories: ['calligraphy-namelipi', 'islamic-corner'],
      status: 'Placeholder content',
      summary: 'A temporary placeholder for calligraphy or Namelipi work. Supplied artwork, language, and captions will replace this entry.'
    }
  ];

  // Content archives live in their own data files so new work can be added without changing UI components.
  const projects = [...baseProjects, ...graphicDesignArchive, ...thumbnailArchive, ...videoArchive, ...banglaNamelipiArchive, ...arabicCalligraphyArchive];

  const routeTitles = {
    '/': 'Home',
    '/work': 'Work',
    '/islamic-corner': 'Islamic Corner',
    '/bangla-namelipi': 'Bangla Namelipi',
    '/arabic-calligraphy': 'Arabic Calligraphy',
    '/prompt-archive': 'Prompt Archive',
    '/about': 'About',
    '/contact': 'Contact'
  };

  const iconArrow = '<span aria-hidden="true">↗</span>';
  const iconRight = '<span aria-hidden="true">→</span>';

  // Contact form → Google Sheets, via a Google Apps Script Web App.
  // Apps Script does not return CORS headers, so the request must be sent with
  // mode: 'no-cors'. The response is therefore opaque: the browser can confirm
  // the request left the page, but it cannot read a status code back.
  const CONTACT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzcBKg65XVc15rakk6jUdgBaSjxnN4oAWVrY6k5c3PVg2n5GHhZlT7VWUG2FIHjKpO_/exec';
  const CONTACT_BUTTON_LABEL = `Send message ${iconArrow}`;
  const CONTACT_BUTTON_SENDING = 'Sending...';

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function currentPath() {
    const raw = window.location.hash ? window.location.hash.slice(1) : '/';
    return raw && raw.startsWith('/') ? raw : `/${raw}`;
  }

  function getCategory(slug) {
    return categories.find((category) => category.slug === slug);
  }

  function getProject(slug) {
    return projects.find((project) => project.slug === slug || project.legacySlug === slug);
  }

  function projectDisplayTitle(project) {
    return project.title || project.displayTitle || 'Project detail placeholder';
  }

  function routeLink(href, label, className = 'button-link') {
    return `<a class="${className}" href="#${href}">${escapeHtml(label)} ${iconArrow}</a>`;
  }

  function visualPlaceholder(kind = 'archive', label = 'Visual placeholder', index = '') {
    return `
      <div class="visual-placeholder visual-placeholder--${escapeHtml(kind)}" role="img" aria-label="${escapeHtml(label)}">
        ${index ? `<span class="placeholder-index">${escapeHtml(index)}</span>` : ''}
        <span class="placeholder-label">${escapeHtml(label)}</span>
      </div>
    `;
  }

  function metaLine(items) {
    return `<div class="project-meta">${items.filter(Boolean).map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div>`;
  }

  function projectMeta(project) {
    const tags = (project.tags || []).filter((tag) => tag !== project.label);
    const titleStatus = project.titleSupplied === false ? 'Title not supplied' : null;
    return metaLine([project.label, ...tags, titleStatus, project.platform, project.duration, project.status]);
  }

  function localizedAttrs(project) {
    return project.language === 'bn' ? ' class="bengali-text" lang="bn"' : '';
  }

  function mediaVisual(project, index = '') {
    const displayTitle = projectDisplayTitle(project);
    const thumbSrc = project.imageSrc || project.posterImage;
    if (!thumbSrc) return visualPlaceholder(project.visual, displayTitle, index);
    const alt = project.imageAlt || displayTitle;
    const loading = project.featured ? 'eager' : 'lazy';
    const fetchPriority = project.featured ? ' fetchpriority="high"' : '';
    const playBadge = project.video ? '<span class="media-asset__play" aria-hidden="true">▶</span>' : '';
    return `
      <figure class="media-asset media-asset--${escapeHtml(project.visual || 'archive')}${project.video ? ' media-asset--video' : ''}${project.aspectRatio === '9:16' ? ' media-asset--portrait' : ''}">
        <img src="${escapeHtml(thumbSrc)}" alt="${escapeHtml(alt)}" loading="${loading}" decoding="async"${fetchPriority} />
        ${playBadge}
      </figure>
    `;
  }

  function projectCard(project, index = '') {
    const displayTitle = projectDisplayTitle(project);
    const action = project.video
        ? `<button class="project-card__button" type="button" data-open-video="${escapeHtml(project.slug)}" aria-label="Play ${escapeHtml(displayTitle)}">`
        : `<button class="project-card__button" type="button" data-open-project="${escapeHtml(project.slug)}" aria-label="Open ${escapeHtml(displayTitle)} details">`;
    const close = '</button>';
    return `
      <article class="project-card${project.video ? ' project-card--video' : ''}${project.aspectRatio === '9:16' ? ' project-card--portrait' : ''} reveal reveal-delay-${Math.min(Number(index) || 0, 3)}">
        ${action}
          <div class="project-card__visual">
            ${mediaVisual(project, index ? String(index).padStart(2, '0') : '')}
          </div>
          <div class="project-card__info">
            ${projectMeta(project)}
            <h3 class="project-card__title">
              <span${localizedAttrs(project)}>${escapeHtml(displayTitle)}</span>
              <span class="project-card__arrow" aria-hidden="true">→</span>
            </h3>
          </div>
        ${close}
      </article>
    `;
  }

  /* ---- Smooth accordion list -------------------------------------
     Vertical, expandable alternative to the project grid. The header
     shows an 80px square thumbnail plus the title/category; the body
     holds the full-size original image and is revealed on click. */
  // Copies a full Ayat/Hadith card: Arabic, Bengali translation and the
  // reference, each on its own line.
  function copyVerseCard(button) {
    const card = button.closest('.verse-card');
    if (!card) return;

    const pick = (selector) => {
      const node = card.querySelector(selector);
      return node ? (node.textContent || '').trim() : '';
    };

    const arabic = pick('.verse-card__arabic');
    const bengali = pick('.verse-card__bengali');
    const source = pick('.verse-card__source');

    const text = [arabic, bengali, source].filter(Boolean).join('\n\n');
    if (!text) return;

    const confirm = () => {
      button.classList.add('is-copied');
      window.setTimeout(() => button.classList.remove('is-copied'), 1200);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(confirm).catch(() => legacyCopy(text) && confirm());
      return;
    }
    if (legacyCopy(text)) confirm();
  }

  // Copies a command chip's text (e.g. "/portrait") to the clipboard.
  // navigator.clipboard requires a secure context, so a textarea-based
  // fallback keeps this working over plain http:// previews too.
  function copyCommandChip(chip) {
    const text = (chip.textContent || '').trim();
    if (!text) return;

    const confirm = () => {
      chip.classList.add('is-copied');
      window.setTimeout(() => chip.classList.remove('is-copied'), 1200);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(confirm).catch(() => legacyCopy(text) && confirm());
      return;
    }
    if (legacyCopy(text)) confirm();
  }

  function legacyCopy(text) {
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.top = '-9999px';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(area);
      return ok;
    } catch (error) {
      return false;
    }
  }

  function accordionItem(project, index = '') {
    const displayTitle = projectDisplayTitle(project);
    const fullSrc = project.imageSrc || project.posterImage;
    const alt = project.imageAlt || displayTitle;
    const category = project.label || 'Project';
    const num = index ? String(index).padStart(2, '0') : '';

    const thumb = fullSrc
      ? `<img class="accordion-thumb" src="${escapeHtml(fullSrc)}" alt="" loading="lazy" decoding="async" draggable="false" />`
      : `<span class="accordion-thumb accordion-thumb--placeholder" aria-hidden="true">${escapeHtml(num || '—')}</span>`;

    const full = fullSrc
      ? `<img class="accordion-full" src="${escapeHtml(fullSrc)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" draggable="false" />`
      : visualPlaceholder(project.visual, displayTitle, num);

    const summary = project.summary
      ? `<p class="accordion-summary"${localizedAttrs(project)}>${escapeHtml(project.summary)}</p>`
      : '';

    const action = project.video
      ? `<button class="button-link" type="button" data-open-video="${escapeHtml(project.slug)}">Play video</button>`
      : `<button class="button-link" type="button" data-open-project="${escapeHtml(project.slug)}">Open details</button>`;

    const panelId = `accordion-panel-${escapeHtml(project.slug)}`;

    return `
      <div class="accordion-item">
        <div class="accordion-header" role="button" tabindex="0" aria-expanded="false" aria-controls="${panelId}">
          ${thumb}
          <div class="accordion-heading">
            <h3 class="accordion-title"><span${localizedAttrs(project)}>${escapeHtml(displayTitle)}</span></h3>
            <span class="accordion-category">${escapeHtml(category)}</span>
          </div>
          <span class="accordion-indicator" aria-hidden="true">+</span>
        </div>
        <div class="accordion-content" id="${panelId}">
          ${full}
          ${summary}
          <div class="accordion-actions">${action}</div>
        </div>
      </div>
    `;
  }

  // Only one item stays open at a time; clicking an open item closes it.
  function toggleAccordion(header) {
    const item = header.closest('.accordion-item');
    if (!item) return;
    const willOpen = !item.classList.contains('active');
    const root = item.closest('.accordion-list') || document;
    root.querySelectorAll('.accordion-item.active').forEach((other) => {
      if (other === item) return;
      other.classList.remove('active');
      const otherHeader = other.querySelector('.accordion-header');
      if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
    });
    item.classList.toggle('active', willOpen);
    header.setAttribute('aria-expanded', String(willOpen));
  }

  function accordionItems(entries) {
    return entries.map((entry, i) => accordionItem(entry, i + 1)).join('');
  }

  function accordionList(entries) {
    return `<div class="accordion-list">${accordionItems(entries)}</div>`;
  }

  function videoFacade(id, title = 'Short-form video placeholder', portrait = false) {
    const sourceProject = getProject(id);
    const poster = sourceProject?.imageSrc || sourceProject?.posterImage;
    if (sourceProject?.aspectRatio === '9:16') portrait = true;
    const posterStyle = poster
      ? ` style="background-image: linear-gradient(135deg, rgba(33, 26, 17, 0.16), rgba(33, 26, 17, 0.74)), url('${escapeHtml(poster)}'); background-size: cover; background-position: center;"`
      : '';
    return `
      <button class="video-facade${portrait ? ' video-facade--portrait' : ''}${poster ? ' video-facade--poster' : ''}" type="button" data-open-video="${escapeHtml(id)}" aria-label="Open video facade for ${escapeHtml(title)}">
        <span class="video-facade__visual"${posterStyle} aria-hidden="true"></span>
        <span class="video-facade__top"><span>Video facade</span><span>${poster ? 'Poster image' : 'External link'}</span></span>
        <span class="video-facade__play" aria-hidden="true">▶</span>
        <span class="video-facade__bottom">
          <span class="video-facade__title${sourceProject?.language === 'bn' ? ' bengali-text' : ''}"${sourceProject?.language === 'bn' ? ' lang="bn"' : ''}>${escapeHtml(title)}</span>
          <span class="video-facade__hint">${poster ? 'Open to watch' : 'Link and poster image will be supplied later.'}</span>
        </span>
      </button>
    `;
  }

  function pageHeader(eyebrow, title, intro, note = '') {
    return `
      <section class="page-header reveal">
        <div class="page-header__label">
          <span class="eyebrow">${escapeHtml(eyebrow)}</span>
          ${note ? `<div class="page-header__note"><span>${escapeHtml(note)}</span><span aria-hidden="true">↘</span></div>` : ''}
        </div>
        <div class="page-header__copy">
          <h1 class="motion-color-title">${title}</h1>
          <p class="page-header__intro">${escapeHtml(intro)}</p>
        </div>
      </section>
    `;
  }

  function renderHome() {
    const practice = categories.slice(0, 5).map((category, index) => `
      <a class="practice-item" href="#/category/${category.slug}">
        <span class="practice-item__number">${String(index + 1).padStart(2, '0')}</span>
        <span class="practice-item__title">${escapeHtml(category.title)}</span>
        <span class="practice-item__desc">${escapeHtml(category.label)}</span>
        <span class="practice-item__arrow" aria-hidden="true">→</span>
      </a>
    `).join('');

    return `
      <div class="page page--home">
        <section class="home-hero page-section reveal">
          <div class="hero-topline">
            <span class="eyebrow">Visual practice / 2026</span>
            <span>01 — 04 / Curated home</span>
          </div>
          <div class="hero-layout">
            <div class="hero-column hero-column--text">
              <h1 class="hero-title motion-color-title">Visual Designer<br /><span>&amp; Video Editor.</span></h1>
              <p class="hero-bio">Emdadul Hoque — <strong>Visual Designer · Video Editor · Creative Content Creator</strong>. Selected work in graphic design, video editing and AI-assisted visual storytelling.</p>
              <div class="hero-support__meta">Short-form video / Poster + graphic design</div>
            </div>
            <div class="hero-column hero-column--media">
              <div class="hero-photo">
                <div class="portrait-wrapper">
                  <img class="hero-photo__img" src="assets/hero-portrait.png" alt="Emdadul Hoque Emon" loading="eager" decoding="async" fetchpriority="high" />
                  <img id="easter-egg-home" class="easter-svg-btn" src="./assets/Donot%20Click.svg" alt="Do Not Click" style="position: absolute !important; top: 65% !important; right: -10px !important; width: 40px !important; height: auto !important; cursor: pointer !important; z-index: 100 !important; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5)) !important;">
                </div>
              </div>
            </div>
          </div>
          <div class="scroll-cue">Scroll to explore</div>
        </section>

        <section class="page-section reveal reveal-delay-1">
          <div class="section-heading">
            <div>
              <div class="section-topline"><span>Practice index / 01</span><span>Dedicated category routes</span></div>
              <h2 class="section-title motion-color-title">Explore<br /><span>by practice.</span></h2>
            </div>
            <p class="section-heading__side">Each route is reusable for future project additions and can cross-index the same project without duplicating it.</p>
          </div>
          <div class="practice-list">${practice}</div>
        </section>

        <section class="page-section split-promos reveal">
          <a class="promo-card" href="#/islamic-corner">
            <div class="promo-card__top"><span class="promo-card__number">02 / Dedicated section</span><span class="promo-card__symbol" aria-hidden="true"><svg class="promo-card__icon" viewBox="0 0 24 24" fill="currentColor" focusable="false"><path d="M15.2 3.3a9 9 0 1 0 5.5 15.9 7.2 7.2 0 1 1-5.5-15.9Z"/><path d="m18.7 3 .82 2.05L21.6 5.9l-2.08.85L18.7 8.8l-.82-2.05L15.8 5.9l2.08-.85L18.7 3Z"/></svg></span></div>
            <h3>Islamic <em>Corner.</em></h3>
            <div class="promo-card__bottom"><span>Dawah / Islamic visual content / Calligraphy</span><span aria-hidden="true">↗</span></div>
          </a>
          <a class="promo-card promo-card--warm" href="#/prompt-archive">
            <div class="promo-card__top"><span class="promo-card__number">03 / Process archive</span><span class="promo-card__symbol" aria-hidden="true"><svg class="promo-card__icon" viewBox="0 0 24 24" fill="currentColor" focusable="false"><path d="M4.5 5.8a1.2 1.2 0 0 1 1.9-1.5l4.8 6a1.2 1.2 0 0 1 0 1.5l-4.8 6a1.2 1.2 0 0 1-1.9-1.5L8.6 11 4.5 5.8Z"/><rect x="11.4" y="16.6" width="8.6" height="2.4" rx="1.2"/></svg></span></div>
            <h3>Prompt <em>Archive.</em></h3>
            <div class="promo-card__bottom"><span>AI-assisted creative work / Iteration notes</span><span aria-hidden="true">↗</span></div>
          </a>
        </section>

        <section class="page-section callout reveal">
          <h2>Made to<br /><em>expand.</em></h2>
          <div class="callout__copy">
            <p>The foundation is built as a living portfolio system: curated at the front, structured underneath, and ready for real project material when it is supplied.</p>
            <div class="button-row">${routeLink('/contact', 'Go to contact', 'button-link button-link--warm')}</div>
          </div>
        </section>
      </div>
    `;
  }

  function renderWork() {
    const cards = projects.map((project, index) => projectCard(project, index + 1)).join('');
    return `
      <div class="page">
        ${pageHeader('02 / Portfolio index', 'Selected work.', 'A reusable work index for graphic design, video editing, thumbnails, motion, social content, calligraphy, and editorial visual storytelling.', 'Curated placeholders only')}
        <section class="page-section reveal">
          <div class="section-heading">
            <div><div class="section-topline"><span>Work set / 01</span><span>Future-ready structure</span></div><h2 class="section-title motion-color-title">Initial<br /><span>placeholders.</span></h2></div>
            <p class="section-heading__side">No archive population has been added in this phase. These cards are only layout and interaction scaffolds.</p>
          </div>
          <div class="project-grid">${cards}</div>
        </section>
      </div>
    `;
  }

  function renderCategory(slug) {
    const category = getCategory(slug);
    if (!category) return renderNotFound();
    const matching = projects.filter((project) => project.categories.includes(slug));
    const entries = matching.length ? matching : [{
      slug: `${slug}-placeholder`,
      title: `${category.title} placeholder`,
      label: category.label,
      visual: 'archive',
      categories: [slug],
      status: 'Placeholder content',
      summary: `A temporary placeholder for the ${category.title} category. Real project material will be added later.`
    }];
    const cards = accordionList(entries);
    const hasVideo = slug === 'video-editing';
    const videoProject = projects.find((project) => project.video && project.featured) || projects.find((project) => project.video);

    return `
      <div class="page">
        ${pageHeader(`${category.index} / Category hub`, escapeHtml(category.title), category.intro, 'Dedicated route / Reusable hub')}
        ${hasVideo ? `
          <section class="page-section reveal">
            <div class="section-heading">
              <div><div class="section-topline"><span>Video facade / 01</span><span>Link-driven workflow</span></div><h2 class="section-title motion-color-title">Watch<br /><span>when ready.</span></h2></div>
              <p class="section-heading__side">The facade is designed to hold a poster frame and load an external player only when a real video link is available.</p>
            </div>
            ${videoProject ? videoFacade(videoProject.slug, videoProject.title) : videoFacade('short-form-video-placeholder', 'Short-form video placeholder')}
          </section>
        ` : ''}
        <section class="page-section reveal">
          <div class="section-heading">
            <div><div class="section-topline"><span>Category work / 02</span><span>${escapeHtml(category.label)}</span></div><h2 class="section-title motion-color-title">Category<br /><span>work.</span></h2></div>
            <p class="section-heading__side">The category can later support filters, project metadata, related work, and a full archive without changing its route.</p>
          </div>
          ${cards}
        </section>
      </div>
    `;
  }

  function renderIslamicCorner() {
    const verseCard = (entry, position) => {
      const delayClass = position % 3 === 1 ? ' reveal-delay-1' : (position % 3 === 2 ? ' reveal-delay-2' : '');
      const arabic = entry.arabic ? `<p class="verse-card__arabic arabic-text" lang="ar" dir="rtl">${escapeHtml(entry.arabic)}</p>` : '';
      const copyButton = `<button class="verse-card__copy" type="button" data-copy-verse aria-label="Copy this text" title="Copy"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m0 16H8V7h11Z"/></svg></button>`;
      return `<figure class="verse-card${entry.arabic ? '' : ' verse-card--reminder'} reveal${delayClass}">${arabic}<blockquote class="verse-card__bengali bengali-text" lang="bn">${escapeHtml(entry.bengali)}</blockquote><figcaption class="verse-card__source bengali-text" lang="bn">— ${escapeHtml(entry.source)}</figcaption>${copyButton}</figure>`;
    };
    const verseGrid = (entries) => `<div class="verse-grid">${entries.map((entry, index) => verseCard(entry, index)).join('')}</div>`;

    const ayats = Array.isArray(islamicCornerContent.ayats) ? islamicCornerContent.ayats : [];
    const hadiths = Array.isArray(islamicCornerContent.hadiths) ? islamicCornerContent.hadiths : [];
    const reminders = Array.isArray(islamicCornerContent.reminders) ? islamicCornerContent.reminders : [];
    const masalah = Array.isArray(islamicCornerContent.masalah) ? islamicCornerContent.masalah : [];

    const ayatSection = ayats.length ? `
        <section class="page-section reveal">
          <div class="section-heading"><div><div class="section-topline"><span>Islamic Corner / 01</span><span lang="bn" class="bengali-text">কুরআনের আয়াত</span></div><h2 class="section-title motion-color-title">Words of<br /><span style="color: var(--acid);">the Qur'an.</span></h2></div><p class="section-heading__side">Selected ayats presented in the original Arabic with Bengali translation. Each entry carries its surah and verse reference.</p></div>
          ${verseGrid(ayats)}
        </section>` : '';

    const hadithSection = hadiths.length ? `
        <section class="page-section reveal">
          <div class="section-heading"><div><div class="section-topline"><span>Islamic Corner / 02</span><span lang="bn" class="bengali-text">হাদিস</span></div><h2 class="section-title motion-color-title">From the<br /><span style="color: var(--acid);">Sunnah.</span></h2></div><p class="section-heading__side">Sahih hadiths on intention, character, purity, kindness, honest work, and the safety of others — each with its collection and number.</p></div>
          ${verseGrid(hadiths)}
        </section>` : '';

    const reminderSection = reminders.length ? `
        <section class="page-section reveal">
          <div class="section-heading"><div><div class="section-topline"><span>Islamic Corner / 03</span><span lang="bn" class="bengali-text">ইসলামিক রিমাইন্ডার</span></div><h2 class="section-title motion-color-title">Gentle<br /><span style="color: var(--acid);">reminders.</span></h2></div><p class="section-heading__side">Short reflections in Bengali on tawakkul, prayer, the akhirah, patience with loss, tawbah, and self-accountability.</p></div>
          ${verseGrid(reminders)}
        </section>` : '';

    const masalahSection = masalah.length ? `
        <section class="page-section reveal">
          <div class="section-heading"><div><div class="section-topline"><span>Islamic Corner / 04</span><span lang="bn" class="bengali-text">প্রাত্যহিক মাসআলা ও সুন্নাহ</span></div><h2 class="section-title motion-color-title">Daily<br /><span style="color: var(--acid);">guidance.</span></h2></div><p class="section-heading__side">Everyday masalah and sunnah etiquette — wudu, salam, meals, sleep, sneezing, and seeking permission — with sources noted per entry.</p></div>
          <div class="guideline-list">${masalah.map((entry, index) => `<article class="guideline-item reveal${index % 2 === 1 ? ' reveal-delay-1' : ''}"><span class="guideline-item__index">${String(index + 1).padStart(2, '0')}</span><div class="guideline-item__body"><p class="bengali-text" lang="bn">${escapeHtml(entry.bengali)}</p><p class="guideline-item__source bengali-text" lang="bn">— ${escapeHtml(entry.source)}</p></div></article>`).join('')}</div>
        </section>` : '';

    return `
      <div class="page">
        ${ayatSection}
        ${hadithSection}
        ${reminderSection}
        ${masalahSection}
        <section class="page-section reveal"><div class="callout"><h2>Context<br /><em>matters.</em></h2><div class="callout__copy"><p>Every entry carries the information needed to distinguish the artwork from its source material and to keep presentation accurate.</p></div></div></section>
      </div>
    `;
  }

  function renderPromptArchive() {
    const hasBengali = (text) => /[\u0980-\u09FF]/.test(text);
    const noteBlock = (text) => `<p class="prompt-group__note${hasBengali(text) ? ' bengali-text' : ''}"${hasBengali(text) ? ' lang="bn"' : ''}>${escapeHtml(text)}</p>`;
    const commandBlock = (items) => `<div class="command-chips">${items.map((command) => `<span class="command-chip" role="button" tabindex="0" title="Click to copy">${escapeHtml(command)}</span>`).join('')}</div>`;
    const comboBlock = (text) => `<code class="command-combo">${escapeHtml(text)}</code>`;
    const groupCard = (group) => {
      const commandCount = group.blocks.filter((block) => block.type === 'commands').reduce((sum, block) => sum + block.items.length, 0);
      const comboCount = group.blocks.filter((block) => block.type === 'combo').length;
      const countLabel = [commandCount ? `${commandCount} command${commandCount === 1 ? '' : 's'}` : '', comboCount ? `${comboCount} combo${comboCount === 1 ? '' : 's'}` : ''].filter(Boolean).join(' / ');
      const body = group.blocks.map((block) => {
        if (block.type === 'commands') return commandBlock(block.items);
        if (block.type === 'combo') return comboBlock(block.text);
        return noteBlock(block.text);
      }).join('');
      return `<article class="prompt-group reveal" id="prompt-group-${escapeHtml(group.index)}"><header class="prompt-group__head"><span class="prompt-group__index">${escapeHtml(group.index)}</span><h3 class="prompt-group__title${hasBengali(group.title) ? ' bengali-text' : ''}"${hasBengali(group.title) ? ' lang="bn"' : ''}>${escapeHtml(group.title)}</h3><span class="prompt-group__count">${escapeHtml(countLabel)}</span></header><div class="prompt-group__body">${body}</div></article>`;
    };

    const totalCommands = promptLibrary.reduce((sum, group) => sum + group.blocks.filter((block) => block.type === 'commands').reduce((groupSum, block) => groupSum + block.items.length, 0), 0);
    const librarySection = promptLibrary.length ? `
        <section class="page-section reveal">
          <div class="section-heading"><div><div class="section-topline"><span>Prompt Archive / 02</span><span>Slash-command library</span></div><h2 class="section-title motion-color-title">A working<br /><span style="color: var(--coral); font-family: var(--font-brand); font-weight: 400;">vocabulary.</span></h2></div><p class="section-heading__side">${promptLibrary.length} command groups and ${totalCommands}+ slash commands for AI-assisted image work — style, camera, light, composition, era, and constraint controls, with tested combinations.</p></div>
          <div class="prompt-library">${promptLibrary.map((group) => groupCard(group)).join('')}</div>
        </section>
        <section class="page-section reveal"><div class="callout"><h2>Stack the<br /><em>commands.</em></h2><div class="callout__copy"><p>A slash prompt reads as a sentence: Subject → Purpose → Era → Composition → Camera → Light → Style → Detail → Constraints. Groups 41–45 show combinations, short magic prompts, and a personal custom vocabulary built from the same system.</p></div></div></section>` : '';

    return `
      <div class="page">
        ${pageHeader('05 / Process archive', 'Prompt<br /><span style="color: var(--coral); font-family: var(--font-brand); font-weight: 400;">Archive.</span>', 'A process-led archive for AI-assisted creative work: intent, prompt, iteration, output, and the human design decisions around them.', 'Slash-command library / 45 groups')}
        <section class="page-section reveal">
          <div class="media-grid media-grid--single">
            <div class="story-copy" style="padding: clamp(1.4rem, 3vw, 3rem); background: var(--paper-light);">
              <span class="eyebrow">Process over spectacle</span>
              <h2 style="margin-top: 1.4rem;">Prompt →<br /><span style="color: var(--coral); font-family: var(--font-brand); font-weight: 400;">decision.</span></h2>
              <p>The archive documents how an idea moves through tools, iterations, editing, and final creative choices. The slash-command library below is the working vocabulary behind that process.</p>
              <div class="note-box">Commands are grouped by purpose — creative direction, photography, lighting, composition, historical reconstruction, education, and more — exactly as they are used in practice.</div>
            </div>
          </div>
        </section>
        ${librarySection}
      </div>
    `;
  }

  function renderAbout() {
    return `
      <div class="page">
        ${pageHeader('06 / Profile', 'About<br /><span style="color: var(--acid);">the practice.</span>', 'A factual introduction to Emdadul Hoque Emon’s current creative identity and areas of practice.', 'Identity / No invented biography')}
        <section class="page-section reveal">
          <div class="about-grid">
            <div>
              <p class="about-lead">Hello, I'm <em>Emdad</em>.</p>
              <p class="about-body">I am currently pursuing my degree in English Language and Literature at IIUC. My journey is uniquely shaped by a deep appreciation for classical literature and a strong passion for the digital creative world.</p>
              <p class="about-body">As a digital creator I specialize in video editing, motion graphics, and graphic design — blending literary insight with digital innovation.</p>
            </div>
            <dl class="about-list">
              <div class="about-list__row"><dt>Primary focus</dt><dd>Short-form video editing; poster and graphic design.</dd></div>
              <div class="about-list__row"><dt>Graphic practice</dt><dd>Graphic design, thumbnail design, motion / animation, social-media design.</dd></div>
              <div class="about-list__row"><dt>Editorial practice</dt><dd>Editorial / visual storytelling; calligraphy / Namelipi.</dd></div>
              <div class="about-list__row"><dt>Dedicated spaces</dt><dd>Dawah / Islamic visual content through Islamic Corner; AI-assisted creative work through Prompt Archive.</dd></div>
              <div class="about-list__row"><dt>More to add</dt><dd>Tools, process notes, biography, links, and selected project details can be added when supplied.</dd></div>
            </dl>
          </div>
        </section>
        <section class="page-section reveal"><div class="callout"><h2>Not a<br /><em>template.</em></h2><div class="callout__copy"><p>The portfolio is designed as a personal visual archive: edited on the surface, structured underneath, and open to future work without changing the identity of the site.</p><div class="button-row">${routeLink('/work', 'Explore the work', 'button-link button-link--filled')}</div></div></div></section>
      </div>
    `;
  }

  function renderContact() {
    return `
      <div class="page">
        ${pageHeader('07 / Contact', 'Get in<br /><span>touch.</span>', 'Email and social links are live below, and the message form posts straight to my workspace.', 'Contact details / Email + social')}
        <section class="page-section reveal">
          <div class="contact-layout">
            <form class="contact-form" id="contact-form" action="${CONTACT_ENDPOINT}" method="POST">
              <div class="form-field"><label for="contact-name">Name</label><input id="contact-name" name="name" type="text" autocomplete="name" placeholder="Your name" required /></div>
              <div class="form-field"><label for="contact-email">Email</label><input id="contact-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required /></div>
              <div class="form-field"><label for="contact-message">Message</label><textarea id="contact-message" name="message" placeholder="What would you like to say?" required></textarea></div>
              <div class="button-row"><button class="button-link button-link--filled" type="submit">${CONTACT_BUTTON_LABEL}</button></div>
              <p class="form-note">Your message will be securely sent directly to my workspace.</p>
              <p class="form-status" id="form-status" role="status" aria-live="polite"></p>
            </form>
            <div class="contact-intro">
              <h2 class="contact-title motion-color-title">Open<br /><span>line.</span></h2>
              <p class="contact-copy">Reach out by email, or follow the work on social platforms.</p>
              <ul class="contact-channels">
                <li><span>Email</span><a href="mailto:emdadulhoqueemon@outlook.com" target="_blank" rel="noopener noreferrer">emdadulhoqueemon@outlook.com</a></li>
                <li><span>YouTube</span><a href="https://www.youtube.com/@emdadsvisual" target="_blank" rel="noopener noreferrer">@emdadsvisual</a></li>
                <li><span>Facebook</span><a href="https://www.facebook.com/emdadulhoqueemo" target="_blank" rel="noopener noreferrer">emdadulhoqueemo</a></li>
                <li><span>LinkedIn</span><a href="https://www.linkedin.com/in/emdadulhoqueemo/" target="_blank" rel="noopener noreferrer">emdadulhoqueemo</a></li>
                <li><span>WhatsApp</span><a href="https://wa.me/emdadulhoqueemon" target="_blank" rel="noopener noreferrer">emdadulhoqueemon</a></li>
                <li><span>Telegram</span><a href="https://t.me/emdadulhoqueemon" target="_blank" rel="noopener noreferrer">emdadulhoqueemon</a></li>
              </ul>
              <div class="note-box">The form is live — messages arrive directly in my workspace, and replies come from emdadulhoqueemon@outlook.com.</div>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function renderNotFound() {
    return `
      <div class="page">
        ${pageHeader('404 / Route', 'Not<br /><span style="color: var(--coral);">found.</span>', 'This route is not part of the current portfolio structure.', 'Return to the index')}
        <section class="page-section"><div class="callout"><h2>Back to<br /><em>the work.</em></h2><div class="callout__copy">${routeLink('/work', 'Open work index', 'button-link button-link--filled')}</div></div></section>
      </div>
    `;
  }

  function renderBanglaNamelipi() {
    const cards = accordionItems(banglaNamelipiArchive);
    const total = banglaNamelipiArchive.length;
    if (banglaGrid) banglaGrid.innerHTML = cards;
    if (banglaCount) {
      banglaCount.textContent = `${total} ${total === 1 ? 'piece' : 'pieces'}`;
    }
    if (banglaEmpty) banglaEmpty.hidden = total > 0;
  }

  function renderArabicCalligraphy() {
    const cards = accordionItems(arabicCalligraphyArchive);
    const total = arabicCalligraphyArchive.length;
    if (arabicGrid) arabicGrid.innerHTML = cards;
    if (arabicCount) {
      arabicCount.textContent = `${total} ${total === 1 ? 'piece' : 'pieces'}`;
    }
    if (arabicEmpty) arabicEmpty.hidden = total > 0;
  }

  function render() {
    const path = currentPath();
    const isBanglaNamelipi = path === '/bangla-namelipi';
    const isArabicCalligraphy = path === '/arabic-calligraphy';
    const isStaticSection = isBanglaNamelipi || isArabicCalligraphy;
    let output;
    if (isStaticSection) output = '';
    else if (path === '/') output = renderHome();
    else if (path === '/work') output = renderWork();
    else if (path === '/islamic-corner') output = renderIslamicCorner();
    else if (path === '/prompt-archive') output = renderPromptArchive();
    else if (path === '/about') output = renderAbout();
    else if (path === '/contact') output = renderContact();
    else if (path.startsWith('/category/')) output = renderCategory(path.replace('/category/', ''));
    else output = renderNotFound();

    app.innerHTML = output;
    // Color motion: apply the moving text gradient to every headline this
    // SPA render just produced — page <h1>s (Graphic Design, Video Editing
    // and the other category hubs, Work, About, Contact, ...), section and
    // contact <h2>s and callout headings — plus the static archive titles
    // outside #app. Runs on every render, so hash navigation can never
    // produce a headline without the effect.
    app.querySelectorAll('h1, h2.section-title, h2.contact-title, .callout h2').forEach((el) => el.classList.add('motion-color-title'));
    document.querySelectorAll('#bangla-namelipi h1, #bangla-namelipi h2.section-title, #arabic-calligraphy h1, #arabic-calligraphy h2.section-title').forEach((el) => el.classList.add('motion-color-title'));
    // The Bangla Namelipi and Arabic Calligraphy sections are static markup
    // outside #app, so the router swaps between the rendered page and those
    // sections instead of overwriting them.
    app.hidden = isStaticSection;
    banglaSection?.classList.toggle('is-active', isBanglaNamelipi);
    arabicSection?.classList.toggle('is-active', isArabicCalligraphy);
    if (isBanglaNamelipi) renderBanglaNamelipi();
    if (isArabicCalligraphy) renderArabicCalligraphy();
    syncNavigation(path);
    document.title = `${routeTitles[path] || 'Portfolio'} — Emdadul Hoque Emon`;
    window.scrollTo(0, 0);
  }

  function syncNavigation(path) {
    document.querySelectorAll('[data-route]').forEach((link) => {
      const isCurrent = link.dataset.route === path;
      if (isCurrent) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function openDrawer() {
    if (state.drawerOpen) return;
    state.drawerReturnFocus = document.activeElement;
    state.drawerOpen = true;
    document.body.classList.add('drawer-open');
    drawer.setAttribute('aria-hidden', 'false');
    drawerToggle.setAttribute('aria-expanded', 'true');
    window.setTimeout(() => drawer.querySelector('.drawer-close')?.focus(), 80);
  }

  function closeDrawer(restoreFocus = true) {
    if (!state.drawerOpen) return;
    state.drawerOpen = false;
    document.body.classList.remove('drawer-open');
    drawer.setAttribute('aria-hidden', 'true');
    drawerToggle.setAttribute('aria-expanded', 'false');
    if (restoreFocus && state.drawerReturnFocus && typeof state.drawerReturnFocus.focus === 'function') {
      state.drawerReturnFocus.focus();
    }
    state.drawerReturnFocus = null;
  }

  function modalTemplate(content, titleId = 'modal-title') {
    return `<div class="modal-backdrop" data-close-modal><section class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="${titleId}" data-modal-panel><div class="modal-panel__top"><span class="eyebrow">Detail</span><button class="modal-panel__close" type="button" data-close-modal aria-label="Close">Close ×</button></div>${content}</section></div>`;
  }

  function openProjectModal(slug) {
    const project = slug === 'islamic-content-placeholder'
      ? { slug, title: 'Dawah visual content placeholder', label: 'Dawah / Islamic visual content', visual: 'archive', categories: ['Islamic Corner'], status: 'Placeholder content', summary: 'A temporary project-detail interaction for Islamic visual content. Supplied artwork, context, and source information will replace this placeholder.' }
      : getProject(slug) || { slug, title: 'Project detail placeholder', label: 'Category placeholder', visual: 'archive', categories: ['To be supplied'], status: 'Placeholder content', summary: 'This interaction is a reusable project-detail scaffold. Real project information will be added only when supplied.' };
    if (!project) return;
    const displayTitle = projectDisplayTitle(project);
    state.modalReturnFocus = document.activeElement;
    state.modalOpen = true;
    modalRoot.innerHTML = modalTemplate(`
      <div class="modal-panel__body">
        ${projectMeta(project)}
        <h2 id="modal-title"${localizedAttrs(project)}>${escapeHtml(displayTitle)}</h2>
        <p class="modal-panel__intro">${escapeHtml(project.summary || (project.titleSupplied === false ? 'No project title or summary was supplied.' : 'No summary supplied.'))}</p>
        <div class="modal-media-grid modal-media-grid--single">
          ${project.video ? videoFacade(project.slug, displayTitle, project.aspectRatio === '9:16') : mediaVisual(project, '01')}
        </div>
        <dl class="modal-detail-list">
          <div class="modal-detail-list__row"><dt>Categories</dt><dd>${escapeHtml([project.label, ...(project.tags || [])].filter(Boolean).join(' / ') || 'To be supplied')}</dd></div>
          <div class="modal-detail-list__row"><dt>Role</dt><dd>${escapeHtml(project.role || 'Not supplied. No role or contribution has been assumed.')}</dd></div>
          <div class="modal-detail-list__row"><dt>Tools / format</dt><dd>${escapeHtml([...(project.tools || []), project.videoType, project.aspectRatio].filter(Boolean).join(' / ') || 'To be supplied')}</dd></div>
          <div class="modal-detail-list__row"><dt>Media note</dt><dd>${project.imageSrc && !project.altTextSupplied ? 'Cover image supplied; alt text was not supplied.' : 'Additional media, captions, credits, and links will be added when supplied.'}</dd></div>
        </dl>
      </div>
    `);
    document.body.classList.add('modal-open');
    window.setTimeout(() => modalRoot.querySelector('.modal-panel__close')?.focus(), 60);
  }

  function videoEmbedUrl(value) {
    if (!value) return '';
    try {
      const url = new URL(value);
      let videoId = '';
      if (url.hostname === 'youtu.be' || url.hostname === 'www.youtu.be') {
        videoId = url.pathname.replace(/^\//, '').split('/')[0];
      } else if (url.hostname.includes('youtube.com')) {
        videoId = url.searchParams.get('v') || url.pathname.match(/\/(?:embed|shorts)\/([^/]+)/)?.[1] || '';
      }
      return videoId ? `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0` : '';
    } catch (error) {
      return '';
    }
  }

  function openVideoModal(id) {
    const project = getProject(id) || { title: 'Video placeholder', videoUrl: '', platform: 'External source' };
    const displayTitle = projectDisplayTitle(project);
    state.modalReturnFocus = document.activeElement;
    state.modalOpen = true;
    const embedUrl = videoEmbedUrl(project.videoUrl);
    const media = embedUrl
      ? `<iframe src="${escapeHtml(embedUrl)}" title="${escapeHtml(displayTitle)}" loading="lazy" allow="fullscreen; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin"></iframe>`
      : `<div class="video-modal__placeholder"><strong>Video link not added</strong>The facade is ready for an external video URL and poster frame. No video has been invented or embedded in this phase.</div>`;
    const externalLink = project.videoUrl
      ? `<div class="button-row"><a class="button-link button-link--filled" href="${escapeHtml(project.videoUrl)}" target="_blank" rel="noopener noreferrer">Open on ${escapeHtml(project.platform || 'external source')} ${iconArrow}</a></div>`
      : '';
    modalRoot.innerHTML = modalTemplate(`
      <div class="modal-panel__body">
        <span class="eyebrow">Video / ${escapeHtml(project.platform || 'External source')}</span>
        <h2 id="modal-title"${localizedAttrs(project)}>${escapeHtml(displayTitle)}</h2>
        <div class="video-modal__frame">${media}</div>
        <p class="modal-panel__intro">${project.videoUrl ? 'The supplied YouTube link is normalized to a privacy-conscious embed and remains available as a direct watch link.' : 'When a real link is supplied, this interaction can load a privacy-conscious player or provide a direct external watch link.'}</p>
        ${externalLink}
      </div>
    `, 'modal-title');
    document.body.classList.add('modal-open');
    window.setTimeout(() => modalRoot.querySelector('.modal-panel__close')?.focus(), 60);
  }

  function closeModal(restoreFocus = true) {
    if (!state.modalOpen) return;
    state.modalOpen = false;
    document.body.classList.remove('modal-open');
    modalRoot.innerHTML = '';
    if (restoreFocus && state.modalReturnFocus && typeof state.modalReturnFocus.focus === 'function') {
      state.modalReturnFocus.focus();
    }
    state.modalReturnFocus = null;
  }

  function focusables(container) {
    return [...container.querySelectorAll('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])')];
  }

  document.addEventListener('click', (event) => {
    // Modal interactions are handled first and in isolation so that closing a
    // video/project overlay never touches routing or the drawer.
    if (state.modalOpen && modalRoot.contains(event.target)) {
      const closeTrigger = event.target.closest('[data-close-modal]');
      const insidePanel = event.target.closest('[data-modal-panel]');
      const isCloseButton = closeTrigger && closeTrigger.classList.contains('modal-panel__close');
      if (isCloseButton || (closeTrigger && !insidePanel)) {
        event.preventDefault();
        event.stopPropagation();
        closeModal();
        return;
      }
      // Inside the panel: allow external links (target=_blank) and the
      // nested video facade to work, but nothing else bubbles to routing.
      const videoButton = event.target.closest('[data-open-video]');
      if (videoButton) {
        event.preventDefault();
        openVideoModal(videoButton.dataset.openVideo);
      }
      return;
    }

    const route = event.target.closest('a[href^="#/"]');
    if (route) closeDrawer(false);

    // The header button now controls the background video, not a theme.
    if (event.target.closest('#bg-toggle-btn, [data-bg-toggle]')) {
      event.preventDefault();
      toggleBg();
      return;
    }

    if (event.target.closest('[data-open-drawer]')) {
      event.preventDefault();
      // The toggle both opens and closes: clicking it while the drawer is
      // open must dismiss it rather than re-running openDrawer() as a no-op.
      if (state.drawerOpen) closeDrawer();
      else openDrawer();
      return;
    }

    if (event.target.closest('[data-close-drawer]')) {
      event.preventDefault();
      closeDrawer();
      return;
    }

    // ---- Islamic Corner: copy a full Ayat card -----------------------
    const copyVerse = event.target.closest('[data-copy-verse]');
    if (copyVerse) {
      event.preventDefault();
      copyVerseCard(copyVerse);
      return;
    }

    // ---- Prompt archive: click a command chip to copy it -------------
    // Delegated so it survives the re-render on every route change.
    const chip = event.target.closest('.command-chip');
    if (chip) {
      event.preventDefault();
      copyCommandChip(chip);
      return;
    }

    // ---- Smooth accordion -------------------------------------------
    // Delegated so it keeps working after every re-render. Buttons inside
    // the open panel (Open details / Play video) must not toggle it, so
    // they are excluded before the header is matched.
    const accordionHeader = event.target.closest('.accordion-header');
    if (accordionHeader && !event.target.closest('[data-open-project], [data-open-video]')) {
      event.preventDefault();
      toggleAccordion(accordionHeader);
      return;
    }

    const projectButton = event.target.closest('[data-open-project]');
    if (projectButton) {
      event.preventDefault();
      openProjectModal(projectButton.dataset.openProject);
      return;
    }

    const videoButton = event.target.closest('[data-open-video]');
    if (videoButton) {
      event.preventDefault();
      openVideoModal(videoButton.dataset.openVideo);
      return;
    }

    if (event.target.closest('[data-close-modal]')) {
      event.preventDefault();
      closeModal();
    }
  });

  // Contact form → Google Sheets (Apps Script Web App).
  // Delegated from document because renderContact() re-renders the form on every
  // route change, which would discard a listener bound directly to the element.
  document.addEventListener('submit', async (event) => {
    const form = event.target;
    if (!form || form.id !== 'contact-form') return;

    // Keep the browser from navigating away with the form data.
    event.preventDefault();

    const button = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    if (button) {
      button.disabled = true;
      button.textContent = CONTACT_BUTTON_SENDING;
    }

    try {
      await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });
      form.reset();
      alert('Message sent successfully!');
    } catch (error) {
      // A rejected fetch means the request never left the browser (offline, DNS,
      // blocked request). Errors reported by the Apps Script itself stay invisible
      // here, because a no-cors response cannot be read.
      alert('Message could not be sent. Please email emdadulhoqueemon@outlook.com instead.');
    } finally {
      if (button) {
        button.disabled = false;
        button.innerHTML = CONTACT_BUTTON_LABEL;
      }
    }
  });

  document.addEventListener('keydown', (event) => {
    // Accordion headers are role="button" + tabindex="0", so Enter/Space
    // must activate them the way a real <button> would.
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      const header = event.target.closest && event.target.closest('.accordion-header');
      if (header) {
        event.preventDefault();
        toggleAccordion(header);
        return;
      }
      const chipTarget = event.target.closest && event.target.closest('.command-chip');
      if (chipTarget) {
        event.preventDefault();
        copyCommandChip(chipTarget);
        return;
      }
    }

    if (event.key === 'Escape') {
      if (state.modalOpen) closeModal();
      else if (state.drawerOpen) closeDrawer();
      return;
    }

    if (event.key !== 'Tab') return;
    const container = state.modalOpen ? modalRoot.querySelector('.modal-panel') : state.drawerOpen ? drawer : null;
    if (!container) return;
    const items = focusables(container);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Clicks on empty space inside the drawer must not close it. Explicit
  // controls (links, [data-close-drawer]) are handled before this fires.
  // Bound on both the panel and its inner container so a click on either
  // surface is stopped before it can reach the document-level handler.
  const stopInsideDrawer = (event) => {
    if (event.target.closest('[data-close-drawer], a[href^="#/"]')) return;
    event.stopPropagation();
  };

  drawer?.addEventListener('click', stopInsideDrawer);
  drawer?.querySelector('.drawer-inner')?.addEventListener('click', stopInsideDrawer);

  window.addEventListener('hashchange', () => {
    closeDrawer(false);
    closeModal(false);
    render();
  });

  // Permanent dark mode: the theme is fixed, so there is nothing to restore.
  // The header button now plays/pauses the background video instead.
  document.documentElement.setAttribute('data-theme', 'dark');

  // The <video autoplay loop muted playsinline> starts itself; mirror its real
  // state on the button (it will read "Play" if autoplay was refused). A
  // reduced-motion visitor gets the first frame only, in the same shape the
  // old poster animation honoured that preference, and can start it manually.
  if (bgVideo && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    bgVideo.pause();
  }
  syncBgButton();

  render();

  const topHeader = document.querySelector(".site-header");
  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    if (!topHeader || state.drawerOpen) return;
    if (window.scrollY > lastScrollY && window.scrollY > 80) {
      topHeader.classList.add("header-hidden");
    } else {
      topHeader.classList.remove("header-hidden");
    }
    lastScrollY = window.scrollY;
  }, { passive: true });
})();

document.addEventListener('DOMContentLoaded', () => {
    // Find the button forcefully
    const btnHome = document.getElementById('easter-egg-home') || document.querySelector('.easter-btn-home');

    if (btnHome) {
        // Clone and replace to kill any old conflicting event listeners
        const newBtn = btnHome.cloneNode(true);
        btnHome.parentNode.replaceChild(newBtn, btnHome);

        newBtn.addEventListener('click', () => {
            // 1. Play Synthesized Alarm Beep
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.value = 800;

                // Vibrato for the glitchy alarm feel
                const lfo = audioCtx.createOscillator();
                lfo.type = 'square';
                lfo.frequency.value = 25;
                const lfoGain = audioCtx.createGain();
                lfoGain.gain.value = 200;
                lfo.connect(lfoGain);
                lfoGain.connect(osc.frequency);
                lfo.start();

                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                setTimeout(() => { osc.stop(); }, 4000);
            } catch(e) { console.log('Audio error', e); }

            // 2. Trigger Earthquake on the whole Body
            document.body.classList.add('earthquake-mode');
            setTimeout(() => {
                document.body.classList.remove('earthquake-mode');
            }, 4000);
        });
    }
});
