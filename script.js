/**
 * CLAUDIA BELTRÁN - SITIO WEB PERSONAL
 * Lógica interactiva: Tema Oscuro/Claro, Menú móvil, Filtros, Animaciones al Scroll y Formulario
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. SELECTOR DE TEMA (CLARO / OSCURO)
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  const rootElement = document.documentElement;

  // Recuperar tema almacenado o preferencia del sistema
  const savedTheme = localStorage.getItem('cb_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    rootElement.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    rootElement.setAttribute('data-theme', 'dark');
  }

  updateThemeToggleAria();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      rootElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('cb_theme', newTheme);
      updateThemeToggleAria();
    });
  }

  function updateThemeToggleAria() {
    if (!themeToggle) return;
    const isDark = rootElement.getAttribute('data-theme') === 'dark';
    themeToggle.setAttribute(
      'aria-label',
      isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
    );
  }

  // --------------------------------------------------------------------------
  // 2. MENÚ DE NAVEGACIÓN MÓVIL
  // --------------------------------------------------------------------------
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Cerrar el menú móvil al hacer clic en cualquier enlace
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Cerrar si se pulsa fuera
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. NAVBAR SCROLLED STATE & ENLACES ACTIVOS
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Sombra en navbar al scrollear
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Identificar sección visible y activar enlace correspondiente
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. ANIMACIONES AL SCROLL (INTERSECTION OBSERVER)
  // --------------------------------------------------------------------------
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    reveals.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback si no está disponible el observer
    reveals.forEach((el) => el.classList.add('active'));
  }

  // --------------------------------------------------------------------------
  // 5. FILTRO INTERACTIVO DE CERTIFICADOS Y ESPECIALIZACIONES
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const certItems = document.querySelectorAll('.cert-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      certItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 6. FORMULARIO DE CONTACTO INTERACTIVO
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Campos
      const nombreInput = document.getElementById('nombre');
      const emailInput = document.getElementById('email');
      const servicioInput = document.getElementById('servicio');
      const mensajeInput = document.getElementById('mensaje');

      // Limpiar errores previos
      clearError(nombreInput);
      clearError(emailInput);
      clearError(mensajeInput);

      // Validación Nombre
      if (!nombreInput.value.trim()) {
        showError(nombreInput);
        isValid = false;
      }

      // Validación Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput);
        isValid = false;
      }

      // Validación Mensaje
      if (!mensajeInput.value.trim()) {
        showError(mensajeInput);
        isValid = false;
      }

      if (!isValid) return;

      // Preparar enlace mailto para envío directo a su correo
      const recipient = 'kklaudieta99@gmail.com';
      const subject = encodeURIComponent(`Consulta Web Claudia Beltrán - ${servicioInput.options[servicioInput.selectedIndex].text}`);
      const body = encodeURIComponent(
        `Nombre: ${nombreInput.value.trim()}\n` +
        `Email: ${emailInput.value.trim()}\n` +
        `Servicio de interés: ${servicioInput.options[servicioInput.selectedIndex].text}\n\n` +
        `Mensaje:\n${mensajeInput.value.trim()}`
      );

      // Mostrar alerta de éxito visual
      if (formSuccessAlert) {
        formSuccessAlert.style.display = 'flex';
      }

      // Disparar cliente de correo
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;

      // Resetear campos
      contactForm.reset();

      setTimeout(() => {
        if (formSuccessAlert) {
          formSuccessAlert.style.display = 'none';
        }
      }, 6000);
    });
  }

  function showError(inputElement) {
    const group = inputElement.closest('.form-group');
    if (group) group.classList.add('has-error');
  }

  function clearError(inputElement) {
    const group = inputElement.closest('.form-group');
    if (group) group.classList.remove('has-error');
  }

  // Quitar error al escribir
  ['nombre', 'email', 'mensaje'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => clearError(el));
    }
  });

  // --------------------------------------------------------------------------
  // 7. BOTÓN VOLVER ARRIBA
  // --------------------------------------------------------------------------
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }
});
