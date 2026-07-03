(function () {
  const html = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.getElementById('navLinks');
  const sections = document.querySelectorAll('main section[id]');

  const aboutContainer = document.getElementById('about-container');
  const heroContainer = document.getElementById('hero-container');
  const artContainer = document.getElementById('art-container');
  const scienceContainer = document.getElementById('science-container');
  const contactContainer = document.getElementById('contact-container');

  async function loadContent() {
    try {
      const response = await fetch('data.json');
      if (!response.ok) throw new Error('Failed to fetch data.json');
      const data = await response.json();

      renderAboutMe(data.aboutMe, aboutContainer);
      renderHero(data.hero, heroContainer);
      renderArt(data.art, artContainer);
      renderScience(data.science, scienceContainer);
      renderContact(data.contact, contactContainer);
      renderFooter(data.footer);

      initSite();

    } catch (error) {
      console.error('Error loading website content:', error);
    }
  }
function initSite() {
  initTheme();
  initMenu();
  initNavigation();
  initRevealAnimations();
  initScrollProgress();
  initStatCounters();
  initLightbox();
  initParallax();

  // Initialize first section (defaults to home or hash in url)
  const currentHash = window.location.hash.substring(1);
  if (currentHash && document.getElementById(currentHash) && document.getElementById(currentHash).classList.contains('section')) {
    showSection(currentHash);
  } else {
    showSection('home');
  }
}

function initParallax() {
  const heroVisual = document.querySelector('.hero-visual');
  if (!heroVisual) return;

  const heroImage = heroVisual.querySelector('img') || heroVisual; // Fallback if no img

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const speed = 0.4; // Adjust for more or less intensity
    const movement = scrolled * speed;

    // Apply transform to the background or the element itself
    // Using background-position is often smoother for parallax on background images
    heroVisual.style.backgroundPositionY = `${movement}px`;
  }, { passive: true });
}

function initScrollProgress() {
...
    const progressElement = document.getElementById('scroll-progress');
    if (!progressElement) return;

    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressElement.style.width = scrolled + "%";
    });
  }

  // --- Theme Logic ---
  function initTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let theme = prefersDark ? 'dark' : 'light';
    html.setAttribute('data-theme', theme);

    function renderThemeIcon(mode) {
      if (!themeToggle) return;
      themeToggle.innerHTML = mode === 'dark'
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
      themeToggle.setAttribute('aria-label', 'Switch to ' + (mode === 'dark' ? 'light' : 'dark') + ' mode');
    }

    renderThemeIcon(theme);
    themeToggle.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', theme);
      renderThemeIcon(theme);
    });
  }

  // --- Menu Logic ---
  function initMenu() {
    const menuOverlay = document.getElementById('menu-overlay');
    if (menuToggle && navLinks && menuOverlay) {
      menuToggle.addEventListener('click', function () {
        const isOpen = navLinks.classList.toggle('open');
        menuOverlay.classList.toggle('is-active', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
      });

      menuOverlay.addEventListener('click', function () {
        navLinks.classList.remove('open');
        menuOverlay.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    }
  }

  // --- Navigation Logic ---
  function initNavigation() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href').substring(1);
        if (!targetId || targetId === 'main-content') return;

        if (targetId === 'about') {
          e.preventDefault();
          showSection('home');
          const bioBlock = document.querySelector('.home-about-panel');
          if (bioBlock) {
            bioBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          if (navLinks) navLinks.classList.remove('open');
          if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
          return;
        }

        const targetSection = document.getElementById(targetId);
        if (targetSection && targetSection.classList.contains('section')) {
          e.preventDefault();
          showSection(targetId);
          window.scrollTo({ top: 0, behavior: 'smooth' });

          if (navLinks) navLinks.classList.remove('open');
          if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  function showSection(id) {
    sections.forEach(section => {
      if (section.id === id) {
        section.classList.remove('hidden');
        section.querySelectorAll('.reveal:not(.is-visible)').forEach(el => {
          el.classList.add('is-visible');
        });
      } else {
        section.classList.add('hidden');
      }
    });

    const navAnchors = document.querySelectorAll('.nav-links a');
    navAnchors.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  }

  // --- Renderers ---
  function renderAboutMe(about, container) {
    if (!container) return;
    container.innerHTML = `
      <article class="about-panel home-about-panel reveal">
        <div class="home-about-content">
          <span class="eyebrow">${about.eyebrow}</span>
          <h2 class="section-title">${about.title}</h2>
          <p class="section-copy">${about.description}</p>
          <div class="about-list">
            ${about.details.map(detail => `<p>${detail}</p>`).join('')}
          </div>
        </div>
        <img src="${about.image}" alt="${about.imageAlt}" class="home-about-image">
      </article>
    `;
  }

  function renderHero(hero, container) {
    if (!container) return;
    container.innerHTML = `
      <div class="reveal is-visible">
        <span class="eyebrow">${hero.eyebrow}</span>
        <h1>${hero.title}</h1>
        <p>${hero.description}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#art">View art</a>
          <a class="btn btn-secondary" href="#contact">Contact me</a>
        </div>
        <div class="stats" aria-label="Highlights">
          ${hero.stats.map(stat => {
            const match = stat.value.match(/(\d+)(\D*)/);
            const num = match ? match[1] : 0;
            const suffix = match ? match[2] : '';
            return `
              <article class="stat">
                <strong data-end="${num}" data-suffix="${suffix}">${num}${suffix}</strong>
                <span>${stat.label}</span>
              </article>
            `;
          }).join('')}
        </div>
      </div>
      <div class="hero-visual reveal" aria-label="Hero image for portfolio">
        <div class="hero-card">
          <small>${hero.card.small}</small>
          <p>${hero.card.text}</p>
        </div>
      </div>
    `;
  }
function renderArt(art, container) {
  if (!container) return;
  container.innerHTML = `
    <div class="reveal">
      <span class="eyebrow">${art.eyebrow}</span>
      <h2 class="section-title">${art.title}</h2>
      <p class="section-copy">${art.description}</p>
      <div class="tag-row" aria-label="Creative categories">
        ${art.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
    </div>
    <div class="gallery reveal">
      ${art.gallery.map(item => `
        <figure>
          <img src="${item.src}" alt="${item.alt}" loading="lazy" class="gallery-image" data-caption="${item.caption}" />
          <figcaption>${item.caption}</figcaption>
        </figure>
      `).join('')}
    </div>
  `;

  // Add lightbox event listeners to the newly rendered images
  container.querySelectorAll('.gallery-image').forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src, img.dataset.caption));
  });
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const closeButton = lightbox.querySelector('.lightbox-close');
  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');

  if (!lightbox || !closeButton || !lightboxImage || !lightboxCaption) return;

  const closeLightbox = () => {
    lightbox.classList.remove('is-active');
    lightbox.setAttribute('aria-hidden', 'true');
  };

  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Attach to window to handle Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-active')) {
      closeLightbox();
    }
  });
}

function openLightbox(src, caption) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');

  if (!lightbox || !lightboxImage || !lightboxCaption) return;

  lightboxImage.src = src;
  lightboxCaption.textContent = caption;
  lightbox.classList.add('is-active');
  lightbox.setAttribute('aria-hidden', 'false');
}

function renderScience(science, container) {
...

    if (!container) return;
    container.innerHTML = `
      <span class="eyebrow">${science.eyebrow}</span>
      <h2 class="section-title reveal">${science.title}</h2>
      <p class="section-copy reveal">${science.description}</p>
      <div class="science-grid">
        ${science.projects.map(project => `
          <article class="science-card reveal">
            <div class="science-meta"><span>${project.year}</span><span>${project.type}</span></div>
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <a href="${project.linkHref}" class="btn btn-secondary">${project.linkText}</a>
          </article>
        `).join('')}
      </div>
    `;
  }

  function renderContact(contact, container) {
    if (!container) return;
    container.innerHTML = `
      <aside class="contact-panel reveal">
        <span class="eyebrow">${contact.eyebrow}</span>
        <h2 class="section-title">${contact.title}</h2>
        <p class="section-copy">${contact.description}</p>
        <div class="contact-list">
          ${contact.items.map(item => `
            <div class="contact-item">
              <strong>${item.label}</strong>
              <span>${item.value}</span>
            </div>
          `).join('')}
        </div>
        <div class="hero-actions">
          <a class="btn btn-primary" href="${contact.cta.href}">${contact.cta.text}</a>
        </div>
      </aside>
    `;
  }

  function renderFooter(footer) {
    const footerElement = document.querySelector('.site-footer');
    if (!footerElement) return;
    footerElement.innerHTML = `
      <div class="container footer-inner">
        <p>${footer.copyright}</p>
        <p>${footer.subtext}</p>
      </div>
    `;
  }

  function initRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.18 });

    document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => observer.observe(el));
  }

  function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);
      element.innerHTML = currentValue + (element.dataset.suffix || '');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  function initStatCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const endValue = parseInt(element.dataset.end);
          const startValue = 0;
          const duration = 2000;
          animateValue(element, startValue, endValue, duration);
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat strong').forEach(el => observer.observe(el));
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', loadContent);

})();
