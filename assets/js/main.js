document.addEventListener('DOMContentLoaded', function () {
  "use strict";

  // =============================================
  // FORM HANDLING
  // =============================================
  const form = document.getElementById('contactForm');
  const formContainer = document.getElementById('formContainer');
  const successMessage = document.getElementById('successMessage');
  const formMessage = document.getElementById('formMessage');
  const submitBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent default form submission

      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="bi bi-hourglass-split" style="margin-right: 8px;"></i> Mengirim...';

      const formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            return response.json().then(data => {
              throw new Error(data.error || 'Gagal mengirim pesan. Silakan coba lagi.');
            });
          }
        })
        .then(data => {
          // Success - hide form and show success message
          formContainer.style.display = 'none';
          successMessage.style.display = 'block';

          // Reset form
          form.reset();
        })
        .catch(error => {
          // Show error message
          formMessage.style.display = 'block';
          formMessage.style.color = '#dc3545';
          formMessage.innerHTML = '<i class="bi bi-exclamation-triangle-fill" style="margin-right: 8px;"></i> ' + error.message;

          // Reset button
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="bi bi-send" style="margin-right: 8px;"></i> Kirim Pesan';

          // Auto hide error after 5 seconds
          setTimeout(() => {
            formMessage.style.display = 'none';
          }, 5000);
        });
    });
  }

  // Function to reset form (show form again)
  window.resetForm = function () {
    const formContainer = document.getElementById('formContainer');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = document.getElementById('submitBtn');

    if (formContainer) formContainer.style.display = 'block';
    if (successMessage) successMessage.style.display = 'none';

    // Reset button state
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bi bi-send" style="margin-right: 8px;"></i> Kirim Pesan';
    }

    // Scroll to form
    const formElement = document.getElementById('formContainer');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // =============================================
  // THEME SWITCHER LOGIC
  // =============================================
  const themeDropdownToggle = document.getElementById('themeDropdownToggle');
  const themeDropdownMenu = document.getElementById('themeDropdownMenu');
  const themeOptions = document.querySelectorAll('.theme-option');
  const currentThemeLabel = document.getElementById('currentThemeLabel');
  const customThemePanel = document.getElementById('customThemePanel');
  const applyCustomBtn = document.getElementById('applyCustomTheme');
  const customBg = document.getElementById('customBgColor');
  const customText = document.getElementById('customTextColor');
  const customAccent = document.getElementById('customAccentColor');
  const musicDisc = document.getElementById('musicDisc');
  const musicDiscCover = document.getElementById('musicDiscCover');
  const musicDiscIcon = document.querySelector('.music-disc-icon i');

  const root = document.documentElement;
  const THEME_STORAGE_KEY = 'realFaceTheme';
  const PRELOADER_SHOWN_KEY = 'realFacePreloaderShown';

  // Default colors untuk setiap tema
  const defaultColors = {
    light: {
      bg: '#f5f7fb',
      text: '#112134',
      heading: '#0b1726',
      accent: '#ff6a00',
      accentRgb: '255, 106, 0',
      surface: '#ffffff',
      contrast: '#0b192c',
      portfolioText: '#4a5568',
      portfolioIcon: '#4a5568',
      heroText: '#ffffff',
      heroHighlight: '#ffffff',
      heroIcon: '#ffffff',
      goldAccent: '#ff9a42',
      goldRgb: '255, 154, 66',
      navColor: '#24344a',
      navHoverColor: '#d04d00',
      navMobileBg: '#f8fafc',
      navDropdownBg: '#ffffff',
      navDropdownColor: '#24344a',
      navDropdownHoverColor: '#d04d00',
      headerBorder: 'rgba(208, 77, 0, 0.18)',
      headerBorderScrolled: 'rgba(208, 77, 0, 0.30)',
      headerBg: 'rgba(245, 247, 251, 0.92)',
      headerBgScrolled: 'rgba(245, 247, 251, 0.98)',
      backgroundImage: 'radial-gradient(circle at 18% 12%, rgba(255, 166, 79, 0.14), transparent 14%), radial-gradient(circle at 80% 18%, rgba(77, 196, 255, 0.10), transparent 18%), radial-gradient(circle at 55% 82%, rgba(210, 235, 255, 0.08), transparent 20%), radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.12), transparent 16%), linear-gradient(135deg, #f7f9fc 0%, #eef4fa 40%, #f4f7fb 100%)'
    },
    dark: {
      bg: '#0b1320',
      text: '#d3dde8',
      heading: '#f7f8fb',
      accent: '#ff6a00',
      accentRgb: '255, 106, 0',
      surface: '#111824',
      contrast: '#1e2b3d',
      portfolioText: '#e6ebf2',
      portfolioIcon: '#e6ebf2',
      goldAccent: '#4dc4ff',
      goldRgb: '77, 196, 255',
      navColor: '#c9d2dd',
      navHoverColor: '#ff8a3c',
      navMobileBg: '#101822',
      navDropdownBg: '#101822',
      navDropdownColor: '#c9d2dd',
      navDropdownHoverColor: '#ff8a3c',
      headerBorder: 'rgba(255, 106, 0, 0.18)',
      headerBorderScrolled: 'rgba(255, 106, 0, 0.35)',
      headerBg: 'rgba(11, 19, 32, 0.78)',
      headerBgScrolled: 'rgba(11, 19, 32, 0.96)',
      backgroundImage: 'radial-gradient(circle at 18% 12%, rgba(90, 240, 255, 0.18), transparent 14%), radial-gradient(circle at 80% 18%, rgba(143, 118, 255, 0.12), transparent 18%), radial-gradient(circle at 55% 82%, rgba(117, 187, 255, 0.10), transparent 20%), radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.08), transparent 16%), linear-gradient(135deg, #030611 0%, #040815 40%, #060c19 100%)'
    }
  };

  // Fungsi untuk mengatur SEMUA CSS variables termasuk navbar
  function setColors(colors) {
    // Global colors
    root.style.setProperty('--background-color', colors.bg);
    root.style.setProperty('--default-color', colors.text);
    root.style.setProperty('--heading-color', colors.heading);
    root.style.setProperty('--accent-color', colors.accent);
    root.style.setProperty('--accent-rgb', colors.accentRgb || hexToRgb(colors.accent));
    root.style.setProperty('--surface-color', colors.surface);
    root.style.setProperty('--contrast-color', colors.contrast);
    root.style.setProperty('--background-image', colors.backgroundImage || 'radial-gradient(circle at 18% 12%, rgba(90, 240, 255, 0.18), transparent 14%), radial-gradient(circle at 80% 18%, rgba(143, 118, 255, 0.12), transparent 18%), radial-gradient(circle at 55% 82%, rgba(117, 187, 255, 0.10), transparent 20%), radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.08), transparent 16%), linear-gradient(135deg, #030611 0%, #040815 40%, #060c19 100%)');
    root.style.setProperty('--gold-accent', colors.goldAccent || '#f7c6d3');
    root.style.setProperty('--gold-rgb', colors.goldRgb || hexToRgb(colors.goldAccent || '#f7c6d3'));
    root.style.setProperty('--muted-accent', colors.mutedAccent || '#6ea889');
    root.style.setProperty('--surface-rgb', colors.surfaceRgb || hexToRgb(colors.surface));
    root.style.setProperty('--portfolio-text-color', colors.portfolioText || colors.text);
    root.style.setProperty('--portfolio-icon-color', colors.portfolioIcon || colors.accent);
    root.style.setProperty('--hero-text-color', colors.heroText || colors.text);
    root.style.setProperty('--hero-highlight-color', colors.heroHighlight || colors.heading);
    root.style.setProperty('--hero-icon-color', colors.heroIcon || colors.accent);

    // Navbar colors
    root.style.setProperty('--nav-color', colors.navColor);
    root.style.setProperty('--nav-hover-color', colors.navHoverColor);
    root.style.setProperty('--nav-mobile-background-color', colors.navMobileBg);
    root.style.setProperty('--nav-dropdown-background-color', colors.navDropdownBg);
    root.style.setProperty('--nav-dropdown-color', colors.navDropdownColor);
    root.style.setProperty('--nav-dropdown-hover-color', colors.navDropdownHoverColor);

    // Header colors
    root.style.setProperty('--header-bg', colors.headerBg);
    root.style.setProperty('--header-bg-scrolled', colors.headerBgScrolled);
    root.style.setProperty('--header-border', colors.headerBorder);
    root.style.setProperty('--header-border-scrolled', colors.headerBorderScrolled);

    // Update header langsung
    updateHeaderColors(colors);
  }

  // Fungsi khusus update header
  function updateHeaderColors(colors) {
    const header = document.querySelector('#header');
    if (header) {
      header.style.setProperty('--background-color', colors.headerBg);
      header.style.backgroundColor = colors.headerBg;
      header.style.borderBottomColor = colors.headerBorder;
    }

    // Update scrolled header
    const scrolledHeader = document.querySelector('.scrolled #header');
    if (scrolledHeader) {
      scrolledHeader.style.setProperty('--background-color', colors.headerBgScrolled);
      scrolledHeader.style.backgroundColor = colors.headerBgScrolled;
    }
  }

  // Deteksi tema sistem (light/dark)
  function getSystemColors() {
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return defaultColors.light;
    } else {
      return defaultColors.dark;
    }
  }

  function hexToRgb(hex) {
    let value = String(hex).trim().replace('#', '');
    if (value.length === 3) {
      value = value.split('').map((ch) => ch + ch).join('');
    }
    const number = parseInt(value, 16);
    const r = (number >> 16) & 255;
    const g = (number >> 8) & 255;
    const b = number & 255;
    return `${r}, ${g}, ${b}`;
  }

  function hexToRgba(hex, alpha) {
    return `rgba(${hexToRgb(hex)}, ${alpha})`;
  }

  // Fungsi utama untuk apply tema
  function applyTheme(themeName, showCustomPanel = true) {
    let colors;

    if (themeName === 'custom') {
      const savedCustom = JSON.parse(localStorage.getItem('realFaceCustomTheme'));
      if (savedCustom) {
        colors = {
          ...defaultColors.dark,
          bg: savedCustom.bg,
          text: savedCustom.text,
          heading: savedCustom.text,
          accent: savedCustom.accent,
          accentRgb: hexToRgb(savedCustom.accent),
          surface: savedCustom.bg,
          contrast: '#ffffff',
          goldAccent: '#f7c6d3',
          goldRgb: '247, 198, 211',
          navColor: savedCustom.text,
          navHoverColor: savedCustom.accent,
          navMobileBg: savedCustom.bg,
          navDropdownBg: savedCustom.bg,
          navDropdownColor: savedCustom.text,
          navDropdownHoverColor: savedCustom.accent,
          headerBg: hexToRgba(savedCustom.bg, 0.75),
          headerBgScrolled: hexToRgba(savedCustom.bg, 0.95),
          headerBorder: hexToRgba(savedCustom.accent, 0.2),
          headerBorderScrolled: hexToRgba(savedCustom.accent, 0.4)
        };
      } else {
        colors = defaultColors.dark;
      }
    } else if (themeName === 'system') {
      colors = getSystemColors();
    } else {
      colors = defaultColors[themeName] || defaultColors.dark;
    }

    // Terapkan warna
    setColors(colors);

    // Simpan tema aktif ke localStorage
    localStorage.setItem(THEME_STORAGE_KEY, themeName);

    // Update label dan tombol aktif
    updateActiveButton(themeName);

    // Update teks label
    const themeLabels = {
      'light': 'Light',
      'dark': 'Dark',
      'system': 'System',
      'custom': 'Custom'
    };
    if (currentThemeLabel) {
      currentThemeLabel.textContent = themeLabels[themeName] || 'Tema';
    }

    // Tampilkan/sembunyikan panel custom
    if (themeName === 'custom') {
      if (customThemePanel) {
        customThemePanel.style.display = showCustomPanel ? 'flex' : 'none';
      }
      if (colors && customBg && customText && customAccent) {
        customBg.value = colors.bg;
        customText.value = colors.text;
        customAccent.value = colors.accent;
      }
    } else {
      if (customThemePanel) {
        customThemePanel.style.display = 'none';
      }
    }

    console.log('🎨 Tema diubah ke:', themeName, colors);
  }

  // Update tombol yang aktif (centang)
  function updateActiveButton(activeTheme) {
    themeOptions.forEach(btn => {
      const theme = btn.getAttribute('data-theme');
      if (theme === activeTheme) {
        btn.classList.add('active-theme');
      } else {
        btn.classList.remove('active-theme');
      }
    });
  }

  // === EVENT LISTENERS UNTUK THEME SWITCHER ===

  // Toggle dropdown saat tombol diklik
  if (themeDropdownToggle) {
    themeDropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (customThemePanel) {
        customThemePanel.style.display = 'none';
      }
      if (themeDropdownMenu) {
        themeDropdownMenu.classList.toggle('active');
      }
    });
  }

  // Tutup dropdown saat klik di luar
  document.addEventListener('click', (e) => {
    const clickedInsideTheme = e.target.closest('.theme-switcher-wrapper');
    const clickedInsideMusic = e.target.closest('.music-player');

    if (!clickedInsideTheme && !clickedInsideMusic) {
      if (themeDropdownMenu) {
        themeDropdownMenu.classList.remove('active');
      }
    }
  });

  // Pilih tema dari dropdown
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      const theme = option.getAttribute('data-theme');
      if (theme) {
        applyTheme(theme, theme === 'custom');
        // Tutup dropdown setelah memilih
        if (themeDropdownMenu) {
          themeDropdownMenu.classList.remove('active');
        }
      }
    });
  });

  // Apply custom theme
  if (applyCustomBtn) {
    applyCustomBtn.addEventListener('click', () => {
      if (customBg && customText && customAccent) {
        const customTheme = {
          bg: customBg.value,
          text: customText.value,
          accent: customAccent.value
        };
        // Simpan custom theme
        localStorage.setItem('realFaceCustomTheme', JSON.stringify(customTheme));
        // Terapkan tanpa menampilkan panel lagi
        applyTheme('custom', false);
      }
    });
  }

  // Deteksi perubahan system theme (saat user ganti mode di OS)
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
    const currentTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (currentTheme === 'system') {
      applyTheme('system');
    }
  });

  // Update header saat scroll
  document.addEventListener('scroll', () => {
    const currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
    const colors = currentTheme === 'custom'
      ? JSON.parse(localStorage.getItem('realFaceCustomTheme'))
      : defaultColors[currentTheme] || defaultColors.dark;

    const header = document.querySelector('#header');
    if (header) {
      if (window.scrollY > 100) {
        header.style.backgroundColor = colors.headerBgScrolled || defaultColors.dark.headerBgScrolled;
        header.style.borderBottomColor = colors.headerBorderScrolled || defaultColors.dark.headerBorderScrolled;
      } else {
        header.style.backgroundColor = colors.headerBg || defaultColors.dark.headerBg;
        header.style.borderBottomColor = colors.headerBorder || defaultColors.dark.headerBorder;
      }
    }
  });

  // Inisialisasi tema saat halaman pertama kali load
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
  applyTheme(savedTheme, false);

  console.log('🎨 Theme Switcher siap! Tema aktif:', savedTheme);

  // =============================================
  // SCROLL HEADER EFFECT
  // =============================================
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader) return;
    if (!selectHeader.classList.contains('scroll-up-sticky') &&
      !selectHeader.classList.contains('sticky-top') &&
      !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  // =============================================
  // MOBILE NAVIGATION TOGGLE
  // =============================================
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    const body = document.querySelector('body');
    body.classList.toggle('mobile-nav-active');

    if (mobileNavToggleBtn) {
      if (body.classList.contains('mobile-nav-active')) {
        mobileNavToggleBtn.classList.remove('bi-list');
        mobileNavToggleBtn.classList.add('bi-x');
      } else {
        mobileNavToggleBtn.classList.remove('bi-x');
        mobileNavToggleBtn.classList.add('bi-list');
      }
    }
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  // Tutup menu mobile saat link diklik
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      const body = document.querySelector('body');
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active');
        if (mobileNavToggleBtn) {
          mobileNavToggleBtn.classList.remove('bi-x');
          mobileNavToggleBtn.classList.add('bi-list');
        }
      }
    });
  });

  // =============================================
  // PRELOADER - CINEMATIC LOGO REVEAL
  // =============================================
  const preloader = document.getElementById('preloader');
  const textElement = document.getElementById('typing-text');
  const logoWrapper = document.querySelector('.logo-wrapper');

  if (preloader && textElement && logoWrapper) {
    const preloaderAlreadyShown = localStorage.getItem(PRELOADER_SHOWN_KEY) === 'true';

    if (preloaderAlreadyShown) {
      preloader.remove();
    } else {
      const fullText = "PACHIN_HYTAM";
      const revealDuration = 4200;
      const totalAnimation = 6000;
      const revealDelay = 650;
      let animationStart = null;

      function updateText(progress) {
        const revealProgress = Math.max(0, Math.min(1, (progress * totalAnimation - revealDelay) / revealDuration));
        const letters = Math.ceil(revealProgress * fullText.length);
        textElement.textContent = fullText.slice(0, letters);
        if (revealProgress > 0.04 && revealProgress < 0.82) {
          textElement.classList.add('lensed');
        } else {
          textElement.classList.remove('lensed');
        }
      }

      function runFrame(timestamp) {
        if (!animationStart) animationStart = timestamp;
        const elapsed = timestamp - animationStart;
        updateText(elapsed / totalAnimation);

        if (elapsed < totalAnimation + 600) {
          requestAnimationFrame(runFrame);
        } else {
          if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.65s ease';
            setTimeout(() => {
              preloader.remove();
              localStorage.setItem(PRELOADER_SHOWN_KEY, 'true');
            }, 650);
          }
        }
      }

      requestAnimationFrame(runFrame);
    }
  }

  // =============================================
  // SCROLL TO TOP BUTTON
  // =============================================
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }

  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  // =============================================
  // AOS (ANIMATION ON SCROLL) INIT
  // =============================================
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }
  window.addEventListener('load', aosInit);

  // =============================================
  // TYPED.JS INIT
  // =============================================
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    if (typed_strings) {
      typed_strings = typed_strings.split(',');
      if (typeof Typed !== 'undefined') {
        new Typed('.typed', {
          strings: typed_strings,
          loop: true,
          typeSpeed: 100,
          backSpeed: 50,
          backDelay: 2000
        });
      }
    }
  }

  // =============================================
  // PURE COUNTER INIT
  // =============================================
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

  // =============================================
  // SKILLS ANIMATION
  // =============================================
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  if (typeof Waypoint !== 'undefined') {
    skillsAnimation.forEach((item) => {
      new Waypoint({
        element: item,
        offset: '80%',
        handler: function (direction) {
          let progress = item.querySelectorAll('.progress .progress-bar');
          progress.forEach(el => {
            el.style.width = el.getAttribute('aria-valuenow') + '%';
          });
        }
      });
    });
  }

  // =============================================
  // SWIPER SLIDERS INIT
  // =============================================
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let configElement = swiperElement.querySelector(".swiper-config");
      if (!configElement) return;
      let config = JSON.parse(configElement.innerHTML.trim());

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  // =============================================
  // GLIGHTBOX INIT
  // =============================================
  if (typeof GLightbox !== 'undefined') {
    const glightbox = GLightbox({
      selector: '.glightbox'
    });
  }

  // =============================================
  // ISOTOPE LAYOUT & FILTERS
  // =============================================
  if (typeof Isotope !== 'undefined' && typeof imagesLoaded !== 'undefined') {
    document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
      let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
      let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
      let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

      let initIsotope;
      let container = isotopeItem.querySelector('.isotope-container');
      if (!container) return;

      imagesLoaded(container, function () {
        initIsotope = new Isotope(container, {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort
        });
      });

      let filters = isotopeItem.querySelectorAll('.isotope-filters li');
      filters.forEach(function (filterItem) {
        filterItem.addEventListener('click', function () {
          let activeFilter = isotopeItem.querySelector('.isotope-filters .filter-active');
          if (activeFilter) activeFilter.classList.remove('filter-active');
          this.classList.add('filter-active');
          if (initIsotope) {
            initIsotope.arrange({
              filter: this.getAttribute('data-filter')
            });
          }
          if (typeof aosInit === 'function') {
            aosInit();
          }
        }, false);
      });
    });
  }

  // =============================================
  // MUSIC PLAYER - NADHIF BASALAMAH PLAYLIST
  // =============================================

  const playlist = [
    { title: "Eve - Aono Waltz", src: "assets/music/Aono-Waltz-Eve.mp3", cover: "assets/img/music/Aono Waltz.jpg" },
    { title: "Eve - Heikousen", src: "assets/music/Heikousen-Eve.mp3", cover: "assets/img/music/Heikousen.jpg" },
    { title: "Eve - Kokoroyohou", src: "assets/music/Kokoroyohou-Eve.mp3", cover: "assets/img/music/Kokoroyohou.jpg" },
    { title: "Eve - Okinimesumama", src: "assets/music/Okinimesumama-Eve.mp3", cover: "assets/img/music/Okinimesumama.jpg" },
    { title: "Eve - Shinkai", src: "assets/music/Shinkai-Eve.mp3", cover: "assets/img/music/Shinkai.jpg" },
    { title: "Eve - Teenage Blue", src: "assets/music/Teenage-Blue–Eve.mp3", cover: "assets/img/music/Teenage Blue.jpg" }
  ];

  const MUSIC_STATE_KEY = 'musicPlayerState';

  function loadMusicState() {
    try {
      const state = JSON.parse(localStorage.getItem(MUSIC_STATE_KEY));
      return state || null;
    } catch (e) { return null; }
  }

  function saveMusicState(state) {
    try {
      localStorage.setItem(MUSIC_STATE_KEY, JSON.stringify(state));
    } catch (e) { }
  }

  const initialState = loadMusicState();
  const audio = new Audio();
  let currentTrackIndex = initialState?.track ?? 0;
  let isPlaying = false;
  let autoplayAttempted = false;
  let autoPausedByVisibility = false;

  const volumeSlider = document.getElementById('volumeSlider');

  if (musicDisc) {
    audio.volume = initialState?.volume ?? 0.3;
    if (volumeSlider) {
      volumeSlider.value = audio.volume;
    }

    function loadTrack(index, seekTime) {
      if (index >= 0 && index < playlist.length) {
        audio.src = playlist[index].src;
        audio.load();
        document.title = `♫ ${playlist[index].title}`;
        if (musicDiscCover) musicDiscCover.src = playlist[index].cover || 'assets/img/favicon.png';
        if (typeof seekTime === 'number' && seekTime > 0) {
          audio.currentTime = seekTime;
        }
      }
    }

    function togglePlayPause() {
      if (isPlaying) {
        audio.pause();
      } else {
        if (!audio.src) loadTrack(currentTrackIndex);
        audio.play().catch(() => { });
      }
    }

    function attemptAutoplay() {
      if (autoplayAttempted) return;
      autoplayAttempted = true;
      if (!audio.src) loadTrack(currentTrackIndex);
      audio.play().catch(() => { });
    }

    function updatePlayButton(state) {
      if (!musicDisc) return;
      if (!musicDiscIcon) return;
      if (state === 'playing') {
        musicDisc.classList.add('playing');
        musicDisc.classList.remove('paused');
        musicDiscIcon.classList.remove('bi-play-fill');
        musicDiscIcon.classList.add('bi-pause-fill');
      } else {
        musicDisc.classList.remove('playing');
        musicDisc.classList.add('paused');
        musicDiscIcon.classList.remove('bi-pause-fill');
        musicDiscIcon.classList.add('bi-play-fill');
      }
    }

    function updateDiscInfo() {
      if (musicDiscCover) musicDiscCover.src = playlist[currentTrackIndex]?.cover || 'assets/img/favicon.png';
      if (musicDisc) {
        if (isPlaying) {
          musicDisc.classList.add('rotating');
        } else {
          musicDisc.classList.remove('rotating');
        }
      }
    }

    function formatTime(sec) {
      if (!sec || isNaN(sec)) return '0:00';
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    // Event listeners untuk music player
    musicDisc.addEventListener('click', () => {
      if (themeDropdownMenu && themeDropdownMenu.classList.contains('active')) {
        themeDropdownMenu.classList.remove('active');
      }
      togglePlayPause();
    });

    audio.addEventListener('play', () => {
      isPlaying = true;
      updatePlayButton('playing');
      updateDiscInfo();
    });

    audio.addEventListener('pause', () => {
      isPlaying = false;
      updatePlayButton('paused');
      updateDiscInfo();
    });

    audio.addEventListener('loadedmetadata', () => {
      updateDiscInfo();
    });

    audio.addEventListener('ended', () => {
      currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
      loadTrack(currentTrackIndex);
      audio.play().then(() => {
        isPlaying = true;
        updatePlayButton('playing');
        updateDiscInfo();
      }).catch(() => {
        updateDiscInfo();
      });
    });

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        audio.volume = parseFloat(e.target.value);
        saveMusicState({
          track: currentTrackIndex,
          time: audio.currentTime,
          playing: isPlaying,
          volume: audio.volume
        });
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !e.target.matches('input, textarea, button')) {
        e.preventDefault();
        togglePlayPause();
      }
      if (e.code === 'KeyN' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) audio.play();
        updateDiscInfo();
      }
      if (e.code === 'KeyP' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) audio.play();
        updateDiscInfo();
      }
    });

    // Save state before unload
    window.addEventListener('beforeunload', () => {
      saveMusicState({
        track: currentTrackIndex,
        time: audio.currentTime,
        playing: isPlaying,
        volume: audio.volume
      });
    });

    // Autoplay logic
    window.addEventListener('load', () => {
      if (initialState) {
        loadTrack(currentTrackIndex, initialState.time);
        updateDiscInfo();
        if (initialState.playing) {
          audio.play().catch(() => { });
        }
      } else {
        loadTrack(currentTrackIndex);
        updateDiscInfo();
        attemptAutoplay();
      }
    });

    let scrollTriggered = false;
    window.addEventListener('scroll', () => {
      if (!scrollTriggered && !isPlaying) {
        scrollTriggered = true;
        attemptAutoplay();
      }
    });

    const heroSection = document.querySelector('#hero');
    if (heroSection) {
      heroSection.addEventListener('mousemove', () => {
        if (!isPlaying) attemptAutoplay();
      }, { once: true });
    }

    document.addEventListener('click', (e) => {
      if (!isPlaying && e.target !== toggleBtn && !toggleBtn?.contains(e.target)) {
        attemptAutoplay();
      }
    }, { once: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (isPlaying) {
          audio.pause();
          autoPausedByVisibility = true;
        }
      } else if (autoPausedByVisibility) {
        audio.play().catch(() => { });
        autoPausedByVisibility = false;
      }
    });

    console.log('🎵 Real Face Playlist siap!');
  }

});