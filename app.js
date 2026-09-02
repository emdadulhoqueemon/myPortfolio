(() => {
  const app = document.getElementById('app');
  const modalRoot = document.getElementById('modal-root');
  const drawer = document.getElementById('site-drawer');
  const drawerToggle = document.querySelector('[data-open-drawer]');
  const drawerClose = document.querySelector('[data-close-drawer]');
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

  const state = {
    drawerOpen: false,
    modalOpen: false,
    drawerReturnFocus: null,
    modalReturnFocus: null,
    archiveFilter: 'all'
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
      title: 'Calligraphy / Namelipi',
      label: 'Letterform / Handwork',
      intro: 'A dedicated route for calligraphy and Namelipi work, with captions and language information to be added per piece.',
      mark: 'Calligraphy\nNamelipi',
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
      slug: 'motion-study-placeholder',
      title: 'Motion study placeholder',
      label: 'Motion / Animation',
      visual: 'motion',
      categories: ['motion-animation', 'editorial-storytelling'],
      status: 'Placeholder content',
      summary: 'A temporary visual placeholder for motion or animation work. No project details have been fabricated.'
    },
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

  const fathMakkah = {
    slug: 'fath-makkah',
    title: 'Fath Makkah',
    label: 'Featured / Flagship Case Study',
    visual: 'fath',
    categories: ['graphic-design', 'video-editing', 'motion-animation', 'editorial-storytelling', 'islamic-corner'],
    status: 'Case study scaffold',
    summary: 'A dedicated flagship route reserved for the Fath Makkah project. Project context, media, process, and links will be populated from supplied materials.'
  };

  const promptEntries = [
    {
      index: '01',
      title: 'Prompt archive entry placeholder',
      tag: 'Process / Placeholder',
      detail: 'A structured place for prompt, iteration, output, and creative decision notes.'
    },
    {
      index: '02',
      title: 'AI-assisted study placeholder',
      tag: 'AI-assisted / Placeholder',
      detail: 'A future entry for documenting an AI-assisted visual experiment without exposing private material.'
    },
    {
      index: '03',
      title: 'Iteration notes placeholder',
      tag: 'Iteration / Placeholder',
      detail: 'A future entry for recording what worked, what changed, and why the final direction was chosen.'
    }
  ];

  const routeTitles = {
    '/': 'Home',
    '/work': 'Work',
    '/project/fath-makkah': 'Fath Makkah',
    '/islamic-corner': 'Islamic Corner',
    '/bangla-namelipi': 'Bangla Namelipi',
    '/arabic-calligraphy': 'Arabic Calligraphy',
    '/prompt-archive': 'Prompt Archive',
    '/about': 'About',
    '/contact': 'Contact'
  };

  const iconArrow = '<span aria-hidden="true">↗</span>';
  const iconRight = '<span aria-hidden="true">→</span>';

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
    if (slug === fathMakkah.slug) return fathMakkah;
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
    if (!project.imageSrc) return visualPlaceholder(project.visual, displayTitle, index);
    const alt = project.imageAlt || '';
    const loading = project.featured ? 'eager' : 'lazy';
    const fetchPriority = project.featured ? ' fetchpriority="high"' : '';
    return `
      <figure class="media-asset media-asset--${escapeHtml(project.visual || 'archive')}">
        <img src="${escapeHtml(project.imageSrc)}" alt="${escapeHtml(alt)}" loading="${loading}" decoding="async"${fetchPriority} />
      </figure>
    `;
  }

  function projectCard(project, index = '') {
    const displayTitle = projectDisplayTitle(project);
    const action = project.slug === 'fath-makkah'
      ? `<a class="project-card__anchor" href="#/project/fath-makkah" aria-label="Open ${escapeHtml(displayTitle)} case study">`
      : `<button class="project-card__button" type="button" data-open-project="${escapeHtml(project.slug)}" aria-label="Open ${escapeHtml(displayTitle)} details">`;
    const close = project.slug === 'fath-makkah' ? '</a>' : '</button>';
    return `
      <article class="project-card${project.video ? ' project-card--video' : ''} reveal reveal-delay-${Math.min(Number(index) || 0, 3)}">
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

  function videoFacade(id, title = 'Short-form video placeholder', portrait = false) {
    const sourceProject = getProject(id);
    const poster = sourceProject?.posterImage || sourceProject?.imageSrc;
    const posterStyle = poster
      ? ` style="background-image: linear-gradient(135deg, rgba(33, 26, 17, 0.16), rgba(33, 26, 17, 0.74)), url('${escapeHtml(poster)}'); background-size: cover; background-position: center;"`
      : '';
    return `
      <button class="video-facade${portrait ? ' video-facade--portrait' : ''}${poster ? ' video-facade--poster' : ''}" type="button" data-open-video="${escapeHtml(id)}" aria-label="Open video facade for ${escapeHtml(title)}">
        <span class="video-facade__visual"${posterStyle} aria-hidden="true"></span>
        <span class="video-facade__top"><span>Video facade</span><span>${poster ? 'YouTube poster' : 'External link'}</span></span>
        <span class="video-facade__play" aria-hidden="true">▶</span>
        <span class="video-facade__bottom">
          <span class="video-facade__title">${escapeHtml(title)}</span>
          <span class="video-facade__hint">${poster ? 'Supplied YouTube poster frame. Open to watch.' : 'Link and poster image will be supplied later.'}</span>
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
          <h1>${title}</h1>
          <p class="page-header__intro">${escapeHtml(intro)}</p>
        </div>
      </section>
    `;
  }

  function renderHome() {
    const curatedProjects = [
      projects.find((project) => project.slug === 'iftar-party-2026'),
      projects.find((project) => project.video && project.featured),
      projects.find((project) => project.slug === 'motion-study-placeholder'),
      projects.find((project) => project.slug === 'namelipi-placeholder')
    ].filter(Boolean);
    const selected = curatedProjects.map((project, index) => projectCard(project, index + 1)).join('');
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
            <span>01 — 08 / Curated home</span>
          </div>
          <div class="hero-layout">
            <div>
              <h1 class="hero-title">Visual Designer<br /><span>&amp; Video Editor.</span></h1>
              <div class="hero-actions">
                ${routeLink('/work', 'View selected work', 'button-link button-link--filled')}
                ${routeLink('/about', 'Read about the practice', 'button-link')}
              </div>
            </div>
            <div class="hero-support">
              <span class="hero-support__line"></span>
              <p class="hero-bio">Emdadul Hoque Emon is a Creative Content Creator focused on <strong>short-form video editing</strong> and poster / graphic design.</p>
              <div class="hero-support__meta">Short-form video / Poster + graphic design</div>
              <div class="hero-mark" aria-hidden="true">
                <span class="hero-mark__label">Still / moving<br />image system</span>
              </div>
            </div>
          </div>
          <div class="scroll-cue">Scroll to explore</div>
        </section>

        <section class="page-section feature-block reveal reveal-delay-1">
          <div class="feature-topline">
            <span>Selected project / 01</span>
            <span>Flagship case study</span>
          </div>
          <div class="feature-grid">
            <div class="feature-visual">
              ${visualPlaceholder('fath', 'Fath Makkah / flagship case study placeholder', '01')}
            </div>
            <div class="feature-copy">
              <div class="feature-copy__top">
                ${metaLine(['Fath Makkah', 'Case study scaffold'])}
                <h2 class="feature-title">Fath <span>Makkah</span></h2>
                <p>The primary featured route for the Fath Makkah project. The page is visually constructed now; project context and media remain intentionally unfilled.</p>
              </div>
              <div class="feature-copy__bottom">
                <span class="eyebrow">Content placeholder / No invented details</span>
                ${routeLink('/project/fath-makkah', 'Open flagship case study', 'button-link button-link--filled')}
              </div>
            </div>
          </div>
        </section>

        <section class="page-section reveal reveal-delay-2">
          <div class="section-heading">
            <div>
              <div class="section-topline"><span>Selected work / 02</span><span>Initial visual set</span></div>
              <h2 class="section-title">A small<br /><span>edit.</span></h2>
            </div>
            <p class="section-heading__side">The first visual construction uses explicit placeholders. It does not imply clients, outcomes, or completed project facts.</p>
          </div>
          <div class="project-grid">${selected}</div>
          <div class="button-row">
            ${routeLink('/work', 'Open work index', 'button-link')}
          </div>
        </section>

        <section class="page-section reveal">
          <div class="section-heading">
            <div>
              <div class="section-topline"><span>Practice index / 03</span><span>Dedicated category routes</span></div>
              <h2 class="section-title">Explore<br /><span>by practice.</span></h2>
            </div>
            <p class="section-heading__side">Each route is reusable for future project additions and can cross-index the same project without duplicating it.</p>
          </div>
          <div class="practice-list">${practice}</div>
        </section>

        <section class="page-section split-promos reveal">
          <a class="promo-card" href="#/islamic-corner">
            <div class="promo-card__top"><span class="promo-card__number">04 / Dedicated section</span><span class="promo-card__symbol" aria-hidden="true"></span></div>
            <h3>Islamic <em>Corner.</em></h3>
            <div class="promo-card__bottom"><span>Dawah / Islamic visual content / Calligraphy</span><span aria-hidden="true">↗</span></div>
          </a>
          <a class="promo-card promo-card--warm" href="#/prompt-archive">
            <div class="promo-card__top"><span class="promo-card__number">05 / Process archive</span><span class="promo-card__symbol" aria-hidden="true"></span></div>
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
          <div class="feature-topline"><span>Flagship / 01</span><span>Fath Makkah</span></div>
          <div class="feature-grid">
            <div class="feature-visual">${visualPlaceholder('fath', 'Fath Makkah / flagship case study placeholder', '01')}</div>
            <div class="feature-copy">
              <div class="feature-copy__top">
                ${metaLine(['Flagship', 'Case study scaffold'])}
                <h2 class="feature-title">Fath <span>Makkah</span></h2>
                <p>The flagship route is ready for the project's supplied context, visual assets, process notes, and video links.</p>
              </div>
              <div class="feature-copy__bottom">${routeLink('/project/fath-makkah', 'Open case study', 'button-link button-link--filled')}</div>
            </div>
          </div>
        </section>
        <section class="page-section reveal">
          <div class="section-heading">
            <div><div class="section-topline"><span>Work set / 02</span><span>Future-ready structure</span></div><h2 class="section-title">Initial<br /><span>placeholders.</span></h2></div>
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
    const cards = entries.map((project, index) => projectCard(project, index + 1)).join('');
    const hasVideo = slug === 'video-editing';
    const videoProject = projects.find((project) => project.video && project.featured) || projects.find((project) => project.video);

    return `
      <div class="page">
        ${pageHeader(`${category.index} / Category hub`, escapeHtml(category.title), category.intro, 'Dedicated route / Reusable hub')}
        <section class="page-section reveal">
          <div class="category-hero-mark category-hero-mark--${category.tone}" aria-hidden="true">${escapeHtml(category.mark).replace('\n', '<br />')}</div>
        </section>
        ${hasVideo ? `
          <section class="page-section reveal">
            <div class="section-heading">
              <div><div class="section-topline"><span>Video facade / 01</span><span>Link-driven workflow</span></div><h2 class="section-title">Watch<br /><span>when ready.</span></h2></div>
              <p class="section-heading__side">The facade is designed to hold a poster frame and load an external player only when a real video link is available.</p>
            </div>
            ${videoProject ? videoFacade(videoProject.slug, videoProject.title) : videoFacade('short-form-video-placeholder', 'Short-form video placeholder')}
          </section>
        ` : ''}
        <section class="page-section reveal">
          <div class="section-heading">
            <div><div class="section-topline"><span>Category work / 02</span><span>${escapeHtml(category.label)}</span></div><h2 class="section-title">Content<br /><span>placeholder.</span></h2></div>
            <p class="section-heading__side">The category can later support filters, project metadata, related work, and a full archive without changing its route.</p>
          </div>
          <div class="project-grid">${cards}</div>
        </section>
      </div>
    `;
  }

  function renderFathMakkah() {
    const ebookPath = 'assets/case-study/fath-makkah-ebook.pdf';
    return `
      <div class="page page--fath-makkah">
        ${pageHeader('03 / Featured project', 'Fath<br /><span style="color: var(--acid);">Makkah.</span>', 'Fath Makkah — An Evidence-Based Historical E-Book.', 'Flagship / Complete case study')}

        <section class="page-section reveal">
          <div class="media-grid">
            <figure class="media-asset media-asset--poster" style="min-height: 30rem; padding: clamp(1rem, 3vw, 2.5rem); background: var(--ink-soft);">
              <img src="assets/case-study/fath-makkah-ebook-cover.webp" alt="Front cover of the Fath Makkah e-book" loading="eager" decoding="async" style="object-fit: contain;" />
            </figure>
            <div class="story-copy" style="padding: clamp(1.4rem, 3vw, 3rem); background: var(--paper-light);">
              <span class="eyebrow">Project / Historical e-book</span>
              <h2 style="margin-top: 1.4rem;">An evidence-based<br /><span style="color: var(--coral); font-family: var(--font-brand); font-weight: 400;">history.</span></h2>
              <p>Fath Makkah is an e-book about the conquest of Makkah. The story starts from the Treaty of Hudaybiyyah and ends with the preparation for the Battle of Hunayn.</p>
              <p class="bengali-text" lang="bn">ফাতহে মক্কা - একটি প্রমাণভিত্তিক ঐতিহাসিক বিবরণ (ই-বুক)।</p>
              <div class="button-row"><a class="button-link button-link--filled" href="${ebookPath}" download="fath-makkah-ebook.pdf" target="_blank" rel="noopener">Read / Download Ebook ${iconArrow}</a></div>
              <div class="note-box">The case study is built from the supplied brief. No client, date, result, or unsupported claim has been added.</div>
            </div>
          </div>
        </section>

        <section class="page-section reveal">
          <div class="story-layout">
            <aside class="story-aside"><p class="story-aside__label">Project facts</p><span class="story-aside__number">15</span><p class="story-aside__label">parts in the e-book</p></aside>
            <div class="story-copy">
              <h2>A clear path from <span style="color: var(--acid);">Hudaybiyyah</span> to Hunayn.</h2>
              <p>The e-book presents a timeline of the events, evidence for each event, and a discussion of what modern writers think about this victory.</p>
              <div class="project-spine">
                <div class="project-spine__item"><span class="project-spine__index">01</span><span class="project-spine__title">The beginning</span><span class="project-spine__detail">The story starts with the Treaty of Hudaybiyyah.</span><span aria-hidden="true">→</span></div>
                <div class="project-spine__item"><span class="project-spine__index">02</span><span class="project-spine__title">Evidence-led history</span><span class="project-spine__detail">The book uses the Qur'an, Sahih Hadith, and old and trusted history books.</span><span aria-hidden="true">→</span></div>
                <div class="project-spine__item"><span class="project-spine__index">03</span><span class="project-spine__title">Fifteen parts</span><span class="project-spine__detail">A clear timeline and a table show the exact proof for every event.</span><span aria-hidden="true">→</span></div>
                <div class="project-spine__item"><span class="project-spine__index">04</span><span class="project-spine__title">The ending</span><span class="project-spine__detail">The narrative ends with preparation for the Battle of Hunayn.</span><span aria-hidden="true">→</span></div>
              </div>
            </div>
          </div>
        </section>

        <section class="page-section reveal">
          <div class="section-heading"><div><div class="section-topline"><span>Why this project / 02</span><span>Evidence over popular retelling</span></div><h2 class="section-title">What makes<br /><span>it special.</span></h2></div><p class="section-heading__side">These statements are taken from the supplied project brief and are presented as the project’s stated approach.</p></div>
          <div class="callout"><h2>Proof<br /><em>first.</em></h2><div class="callout__copy"><p>The book points out fake or weak popular stories while drawing from the Qur'an, Sahih Hadith, and trusted historical sources. Its main message is that the goal of the victory was peace: Prophet Muhammad (PBUH) forgave the people of Makkah and won the city without shedding blood.</p><p class="bengali-text" lang="bn">এই বিজয়ের মূল লক্ষ্য ছিল শান্তি। রাসুলুল্লাহ (সা.) মক্কার মানুষদের ক্ষমা করে দিয়েছিলেন। তিনি রক্তপাত ছাড়াই শহরটি জয় করেছিলেন।</p></div></div>
        </section>

        <section class="page-section reveal">
          <div class="section-heading"><div><div class="section-topline"><span>Cover system / 03</span><span>Front + back</span></div><h2 class="section-title">The book<br /><span>as object.</span></h2></div><p class="section-heading__side">Both supplied cover images are kept visible as part of the case study rather than being reduced to a single thumbnail.</p></div>
          <div class="media-grid">
            <figure class="media-asset media-asset--poster" style="min-height: 28rem; padding: clamp(1rem, 3vw, 2.5rem); background: var(--ink-soft);"><img src="assets/case-study/fath-makkah-ebook-cover.webp" alt="Front cover of the Fath Makkah e-book" loading="lazy" decoding="async" style="object-fit: contain;" /></figure>
            <figure class="media-asset media-asset--poster" style="min-height: 28rem; padding: clamp(1rem, 3vw, 2.5rem); background: var(--ink-soft);"><img src="assets/case-study/fath-makkah-ebook-back-cover.webp" alt="Back cover of the Fath Makkah e-book" loading="lazy" decoding="async" style="object-fit: contain;" /></figure>
          </div>
        </section>

        <section class="page-section reveal">
          <div class="story-layout">
            <aside class="story-aside"><p class="story-aside__label">Author</p><span class="story-aside__number">MH</span></aside>
            <div class="story-copy"><h2>Muhammad<br /><span style="color: var(--acid);">Emdadul Haque.</span></h2><p class="bengali-text" lang="bn">লেখক: মুহাম্মদ ইমদাদুল হক।</p><p>The supplied brief identifies the author as Muhammad Emdadul Haque. The portfolio presents this information as part of the e-book project, without adding biography or credentials that were not supplied.</p><div class="button-row"><a class="button-link button-link--filled" href="${ebookPath}" download="fath-makkah-ebook.pdf" target="_blank" rel="noopener">Read / Download Ebook ${iconArrow}</a></div></div>
          </div>
        </section>
      </div>
    `;
  }

  function renderIslamicCorner() {
    const islamicProjects = projects.filter((project) => project.categories.includes('islamic-corner'));
    const islamicCards = islamicProjects.map((project, index) => projectCard(project, index + 1)).join('');
    const placeholderCard = `<article class="project-card reveal reveal-delay-2"><button class="project-card__button" type="button" data-open-project="islamic-content-placeholder" aria-label="Open Islamic visual content placeholder details"><div class="project-card__visual">${visualPlaceholder('fath', 'Dawah / Islamic visual placeholder', '03')}</div><div class="project-card__info">${metaLine(['Dawah / Islamic visual content', 'Placeholder content'])}<h3 class="project-card__title"><span>Dawah visual content placeholder</span><span class="project-card__arrow" aria-hidden="true">→</span></h3></div></button></article>`;

    const verseCard = (entry, position) => {
      const delayClass = position % 3 === 1 ? ' reveal-delay-1' : (position % 3 === 2 ? ' reveal-delay-2' : '');
      const arabic = entry.arabic ? `<p class="verse-card__arabic arabic-text" lang="ar" dir="rtl">${escapeHtml(entry.arabic)}</p>` : '';
      return `<figure class="verse-card${entry.arabic ? '' : ' verse-card--reminder'} reveal${delayClass}">${arabic}<blockquote class="verse-card__bengali bengali-text" lang="bn">${escapeHtml(entry.bengali)}</blockquote><figcaption class="verse-card__source bengali-text" lang="bn">— ${escapeHtml(entry.source)}</figcaption></figure>`;
    };
    const verseGrid = (entries) => `<div class="verse-grid">${entries.map((entry, index) => verseCard(entry, index)).join('')}</div>`;

    const ayats = Array.isArray(islamicCornerContent.ayats) ? islamicCornerContent.ayats : [];
    const hadiths = Array.isArray(islamicCornerContent.hadiths) ? islamicCornerContent.hadiths : [];
    const reminders = Array.isArray(islamicCornerContent.reminders) ? islamicCornerContent.reminders : [];
    const masalah = Array.isArray(islamicCornerContent.masalah) ? islamicCornerContent.masalah : [];

    const ayatSection = ayats.length ? `
        <section class="page-section reveal">
          <div class="section-heading"><div><div class="section-topline"><span>Islamic Corner / 02</span><span lang="bn" class="bengali-text">কুরআনের আয়াত</span></div><h2 class="section-title">Words of<br /><span style="color: var(--acid);">the Qur'an.</span></h2></div><p class="section-heading__side">Selected ayats presented in the original Arabic with Bengali translation. Each entry carries its surah and verse reference.</p></div>
          ${verseGrid(ayats)}
        </section>` : '';

    const hadithSection = hadiths.length ? `
        <section class="page-section reveal">
          <div class="section-heading"><div><div class="section-topline"><span>Islamic Corner / 03</span><span lang="bn" class="bengali-text">হাদিস</span></div><h2 class="section-title">From the<br /><span style="color: var(--acid);">Sunnah.</span></h2></div><p class="section-heading__side">Sahih hadiths on intention, character, purity, kindness, honest work, and the safety of others — each with its collection and number.</p></div>
          ${verseGrid(hadiths)}
        </section>` : '';

    const reminderSection = reminders.length ? `
        <section class="page-section reveal">
          <div class="section-heading"><div><div class="section-topline"><span>Islamic Corner / 04</span><span lang="bn" class="bengali-text">ইসলামিক রিমাইন্ডার</span></div><h2 class="section-title">Gentle<br /><span style="color: var(--acid);">reminders.</span></h2></div><p class="section-heading__side">Short reflections in Bengali on tawakkul, prayer, the akhirah, patience with loss, tawbah, and self-accountability.</p></div>
          ${verseGrid(reminders)}
        </section>` : '';

    const masalahSection = masalah.length ? `
        <section class="page-section reveal">
          <div class="section-heading"><div><div class="section-topline"><span>Islamic Corner / 05</span><span lang="bn" class="bengali-text">প্রাত্যহিক মাসআলা ও সুন্নাহ</span></div><h2 class="section-title">Daily<br /><span style="color: var(--acid);">guidance.</span></h2></div><p class="section-heading__side">Everyday masalah and sunnah etiquette — wudu, salam, meals, sleep, sneezing, and seeking permission — with sources noted per entry.</p></div>
          <div class="guideline-list">${masalah.map((entry, index) => `<article class="guideline-item reveal${index % 2 === 1 ? ' reveal-delay-1' : ''}"><span class="guideline-item__index">${String(index + 1).padStart(2, '0')}</span><div class="guideline-item__body"><p class="bengali-text" lang="bn">${escapeHtml(entry.bengali)}</p><p class="guideline-item__source bengali-text" lang="bn">— ${escapeHtml(entry.source)}</p></div></article>`).join('')}</div>
        </section>` : '';

    return `
      <div class="page">
        ${pageHeader('04 / Dedicated section', 'Islamic<br /><span style="color: var(--acid);">Corner.</span>', 'A respectful editorial space for Dawah / Islamic visual content, calligraphy, Namelipi, and related visual storytelling.', 'Curated section / Supplied work + placeholders')}
        <section class="page-section reveal">
          <div class="media-grid">
            ${visualPlaceholder('archive', 'Islamic Corner / curated visual placeholder', '01')}
            <div class="story-copy" style="padding: clamp(1.4rem, 3vw, 3rem); background: var(--paper-light);">
              <span class="eyebrow">Editorial principle</span>
              <h2 style="margin-top: 1.4rem;">Make space for <span style="color: var(--acid);">meaning.</span></h2>
              <p>The section presents Islamic visual work and supplied texts with clarity, context, source information, and respectful pacing. Every ayat, hadith, reminder, and masalah below carries its stated source.</p>
              <div class="note-box">Each entry keeps its original language, Bengali rendering, and reference so the artwork and its source material stay clearly distinguished.</div>
            </div>
          </div>
        </section>
        <section class="page-section reveal">
          <div class="section-heading"><div><div class="section-topline"><span>Islamic Corner / 01</span><span>Initial index</span></div><h2 class="section-title">A quiet<br /><span>archive.</span></h2></div><p class="section-heading__side">The archive will grow from supplied Dawah visuals, Islamic design, calligraphy, Namelipi, and related work.</p></div>
          <div class="project-grid">
            ${islamicCards}${placeholderCard}
          </div>
        </section>
        ${ayatSection}
        ${hadithSection}
        ${reminderSection}
        ${masalahSection}
        <section class="page-section reveal"><div class="callout"><h2>Context<br /><em>matters.</em></h2><div class="callout__copy"><p>Every entry carries the information needed to distinguish the artwork from its source material and to keep presentation accurate.</p><div class="button-row">${routeLink('/project/fath-makkah', 'Visit Fath Makkah', 'button-link button-link--filled')}</div></div></div></section>
      </div>
    `;
  }

  function renderPromptArchive() {
    const filtered = state.archiveFilter === 'all'
      ? promptEntries
      : promptEntries.filter((entry) => entry.tag.toLowerCase().includes(state.archiveFilter));
    const entries = filtered.map((entry) => `
      <button class="archive-entry" type="button" data-open-prompt="${escapeHtml(entry.index)}" aria-label="Open ${escapeHtml(entry.title)}">
        <span class="archive-entry__index">${escapeHtml(entry.index)}</span>
        <span class="archive-entry__title">${escapeHtml(entry.title)}</span>
        <span class="archive-entry__detail">${escapeHtml(entry.detail)}</span>
        <span class="archive-entry__arrow" aria-hidden="true">→</span>
      </button>
    `).join('');

    const hasBengali = (text) => /[\u0980-\u09FF]/.test(text);
    const noteBlock = (text) => `<p class="prompt-group__note${hasBengali(text) ? ' bengali-text' : ''}"${hasBengali(text) ? ' lang="bn"' : ''}>${escapeHtml(text)}</p>`;
    const commandBlock = (items) => `<div class="command-chips">${items.map((command) => `<span class="command-chip">${escapeHtml(command)}</span>`).join('')}</div>`;
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
          <div class="section-heading"><div><div class="section-topline"><span>Prompt Archive / 02</span><span>Slash-command library</span></div><h2 class="section-title">A working<br /><span style="color: var(--coral); font-family: var(--font-brand); font-weight: 400;">vocabulary.</span></h2></div><p class="section-heading__side">${promptLibrary.length} command groups and ${totalCommands}+ slash commands for AI-assisted image work — style, camera, light, composition, era, and constraint controls, with tested combinations.</p></div>
          <div class="prompt-library">${promptLibrary.map((group) => groupCard(group)).join('')}</div>
        </section>
        <section class="page-section reveal"><div class="callout"><h2>Stack the<br /><em>commands.</em></h2><div class="callout__copy"><p>A slash prompt reads as a sentence: Subject → Purpose → Era → Composition → Camera → Light → Style → Detail → Constraints. Groups 41–45 show combinations, short magic prompts, and a personal custom vocabulary built from the same system.</p></div></div></section>` : '';

    return `
      <div class="page">
        ${pageHeader('05 / Process archive', 'Prompt<br /><span style="color: var(--coral); font-family: var(--font-brand); font-weight: 400;">Archive.</span>', 'A process-led archive for AI-assisted creative work: intent, prompt, iteration, output, and the human design decisions around them.', 'Slash-command library / 45 groups')}
        <section class="page-section reveal">
          <div class="media-grid">
            ${visualPlaceholder('motion', 'Prompt Archive / process placeholder', '01')}
            <div class="story-copy" style="padding: clamp(1.4rem, 3vw, 3rem); background: var(--paper-light);">
              <span class="eyebrow">Process over spectacle</span>
              <h2 style="margin-top: 1.4rem;">Prompt →<br /><span style="color: var(--coral); font-family: var(--font-brand); font-weight: 400;">decision.</span></h2>
              <p>The archive documents how an idea moves through tools, iterations, editing, and final creative choices. The slash-command library below is the working vocabulary behind that process.</p>
              <div class="note-box">Commands are grouped by purpose — creative direction, photography, lighting, composition, historical reconstruction, education, and more — exactly as they are used in practice.</div>
            </div>
          </div>
        </section>
        <section class="page-section reveal">
          <div class="archive-toolbar"><div class="filter-list" role="group" aria-label="Filter prompt archive"><button class="filter-button" type="button" data-archive-filter="all" aria-pressed="${state.archiveFilter === 'all'}">All</button><button class="filter-button" type="button" data-archive-filter="process" aria-pressed="${state.archiveFilter === 'process'}">Process</button><button class="filter-button" type="button" data-archive-filter="ai-assisted" aria-pressed="${state.archiveFilter === 'ai-assisted'}">AI-assisted</button><button class="filter-button" type="button" data-archive-filter="iteration" aria-pressed="${state.archiveFilter === 'iteration'}">Iteration</button></div><span class="archive-count">${filtered.length} placeholder entries</span></div>
          <div class="archive-list">${entries || '<p class="note-box">No placeholder entries match this filter.</p>'}</div>
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
              <p class="about-lead">Emdadul Hoque Emon is a <em>Visual Designer</em>, Video Editor, and Creative Content Creator.</p>
              <p class="about-body">The strongest focus is short-form video editing and poster / graphic design, supported by a wider practice across image, type, motion, social content, editorial storytelling, Islamic visual content, calligraphy / Namelipi, and AI-assisted creative work.</p>
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
        ${pageHeader('07 / Contact', 'Get in<br /><span>touch.</span>', 'A simple contact experience is ready for a supplied email address, social links, or a connected form endpoint.', 'Contact details / To be supplied')}
        <section class="page-section reveal">
          <div class="contact-layout">
            <div>
              <h2 class="contact-title">Open<br /><span>line.</span></h2>
              <p class="contact-copy">The contact route is intentionally clear and lightweight. No email address, social profile, availability statement, or form destination has been invented.</p>
              <div class="note-box">Add the preferred contact method later. The form below is a visual interaction placeholder and does not send a message yet.</div>
            </div>
            <form class="contact-form" id="contact-form">
              <div class="form-field"><label for="contact-name">Name</label><input id="contact-name" name="name" type="text" autocomplete="name" placeholder="Your name" /></div>
              <div class="form-field"><label for="contact-email">Email</label><input id="contact-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" /></div>
              <div class="form-field"><label for="contact-message">Message</label><textarea id="contact-message" name="message" placeholder="What would you like to say?"></textarea></div>
              <div class="button-row"><button class="button-link button-link--filled" type="submit">Preview submission ${iconArrow}</button></div>
              <p class="form-note">Visual prototype only. No message will be sent in this phase.</p>
              <p class="form-status" id="form-status" role="status" aria-live="polite"></p>
            </form>
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
    const cards = banglaNamelipiArchive.map((entry, index) => projectCard(entry, index + 1)).join('');
    const total = banglaNamelipiArchive.length;
    if (banglaGrid) banglaGrid.innerHTML = cards;
    if (banglaCount) {
      banglaCount.textContent = `${total} ${total === 1 ? 'piece' : 'pieces'}`;
    }
    if (banglaEmpty) banglaEmpty.hidden = total > 0;
  }

  function renderArabicCalligraphy() {
    const cards = arabicCalligraphyArchive.map((entry, index) => projectCard(entry, index + 1)).join('');
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
    else if (path === '/project/fath-makkah') output = renderFathMakkah();
    else if (path === '/islamic-corner') output = renderIslamicCorner();
    else if (path === '/prompt-archive') output = renderPromptArchive();
    else if (path === '/about') output = renderAbout();
    else if (path === '/contact') output = renderContact();
    else if (path.startsWith('/category/')) output = renderCategory(path.replace('/category/', ''));
    else output = renderNotFound();

    app.innerHTML = output;
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
    return `<div class="modal-backdrop" data-close-modal><section class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="${titleId}"><div class="modal-panel__top"><span class="eyebrow">Detail / Initial construction</span><button class="modal-panel__close" type="button" data-close-modal>Close ×</button></div>${content}</section></div>`;
  }

  function openProjectModal(slug) {
    const project = slug === 'islamic-content-placeholder'
      ? { slug, title: 'Dawah visual content placeholder', label: 'Dawah / Islamic visual content', visual: 'fath', categories: ['Islamic Corner'], status: 'Placeholder content', summary: 'A temporary project-detail interaction for Islamic visual content. Supplied artwork, context, and source information will replace this placeholder.' }
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
        <div class="modal-media-grid">
          ${mediaVisual(project, '01')}
          ${project.video ? videoFacade(project.slug, displayTitle, true) : visualPlaceholder('archive', 'Additional media placeholder', '02')}
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
        <span class="eyebrow">Video facade / External source</span>
        <h2 id="modal-title"${localizedAttrs(project)}>${escapeHtml(displayTitle)}</h2>
        <div class="video-modal__frame">${media}</div>
        <p class="modal-panel__intro">${project.videoUrl ? 'The supplied YouTube link is normalized to a privacy-conscious embed and remains available as a direct watch link.' : 'When a real link is supplied, this interaction can load a privacy-conscious player or provide a direct external watch link.'}</p>
        ${externalLink}
      </div>
    `, 'modal-title');
    document.body.classList.add('modal-open');
    window.setTimeout(() => modalRoot.querySelector('.modal-panel__close')?.focus(), 60);
  }

  function openPromptModal(index) {
    const entry = promptEntries.find((item) => item.index === index);
    if (!entry) return;
    state.modalReturnFocus = document.activeElement;
    state.modalOpen = true;
    modalRoot.innerHTML = modalTemplate(`
      <div class="modal-panel__body">
        <span class="eyebrow">${escapeHtml(entry.tag)}</span>
        <h2 id="modal-title">${escapeHtml(entry.title)}</h2>
        <p class="modal-panel__intro">${escapeHtml(entry.detail)}</p>
        <div class="prompt-modal__prompt">Prompt content, references, iterations, tool information, outputs, and final creative decisions will be added here from supplied archive material.</div>
        <div class="note-box">Sensitive or private prompts can be redacted. This archive is designed to document process, not expose information that should remain private.</div>
      </div>
    `);
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
    const route = event.target.closest('a[href^="#/"]');
    if (route) closeDrawer(false);

    if (event.target.closest('[data-open-drawer]')) {
      event.preventDefault();
      openDrawer();
      return;
    }

    if (event.target.closest('[data-close-drawer]')) {
      event.preventDefault();
      closeDrawer();
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

    const promptButton = event.target.closest('[data-open-prompt]');
    if (promptButton) {
      event.preventDefault();
      openPromptModal(promptButton.dataset.openPrompt);
      return;
    }

    const filterButton = event.target.closest('[data-archive-filter]');
    if (filterButton) {
      state.archiveFilter = filterButton.dataset.archiveFilter;
      render();
      return;
    }

    if (event.target.closest('[data-close-modal]')) {
      closeModal();
    }
  });

  document.addEventListener('submit', (event) => {
    if (event.target.id !== 'contact-form') return;
    event.preventDefault();
    const status = document.getElementById('form-status');
    if (status) status.textContent = 'Visual prototype only — no message was sent.';
  });

  document.addEventListener('keydown', (event) => {
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

  window.addEventListener('hashchange', () => {
    closeDrawer(false);
    closeModal(false);
    render();
  });

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
