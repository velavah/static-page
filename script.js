// Day/Night mode toggle
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('velavah-theme');

if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.body.classList.add('dark-mode');
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('velavah-theme', isDark ? 'dark' : 'light');
});

// ===== Scroll Progress Bar =====
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = progress + '%';
});

// ===== Topbar hide on scroll =====
const topbar = document.getElementById('topbar');
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Navbar scrolled state
  navbar.classList.toggle('scrolled', scrollY > 50);

  // Hide topbar after scrolling 80px
  if (scrollY > 80) {
    topbar.classList.add('hidden');
    navbar.classList.add('topbar-hidden');
  } else {
    topbar.classList.remove('hidden');
    navbar.classList.remove('topbar-hidden');
  }

  lastScrollY = scrollY;
});

// Mobile menu toggle with backdrop
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Create backdrop overlay for mobile menu
const menuBackdrop = document.createElement('div');
menuBackdrop.className = 'menu-backdrop';
document.body.appendChild(menuBackdrop);

function toggleMenu() {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', isOpen);
  menuBackdrop.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  menuBackdrop.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', toggleMenu);
menuBackdrop.addEventListener('click', closeMenu);

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    closeMenu();
  }
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
});

// Carousel - responsive scroll amount
const carousel = document.getElementById('pairingsCarousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function getScrollAmount() {
  if (window.innerWidth <= 480) return 230;
  if (window.innerWidth <= 768) return 270;
  return 340;
}

prevBtn.addEventListener('click', () => {
  carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
});

nextBtn.addEventListener('click', () => {
  carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
});

// Contact form
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Message Sent!';
  btn.style.background = '#059669';
  btn.style.borderColor = '#059669';
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.style.background = '';
    btn.style.borderColor = '';
    e.target.reset();
  }, 3000);
});

// Scroll reveal animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.flavor-card, .pairing-card, .testimonial-card, .feature, .about-content, .about-img-wrapper, .contact-info, .contact-form-wrapper, .benefit-card, .faq-item').forEach(el => {
  el.classList.add('reveal-item');
  observer.observe(el);
});

// ===== Animated Counters =====
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  if (target === 0) {
    el.textContent = '0';
    return;
  }

  const duration = 2000;
  const startTime = performance.now();

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    const current = Math.round(easedProgress * target);

    el.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Observe counters
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.benefit-counter').forEach(counter => {
  counterObserver.observe(counter);
});

// Detect touch device
const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

// ===== 3D Interactive Hero Bottle =====
const heroScene = document.getElementById('heroScene');
const bottle3d = document.getElementById('logoCube');

if (heroScene && bottle3d && !isTouchDevice) {
  let isHovering = false;

  heroScene.addEventListener('mouseenter', () => {
    isHovering = true;
    bottle3d.style.animationPlayState = 'paused';
  });

  heroScene.addEventListener('mouseleave', () => {
    isHovering = false;
    bottle3d.style.animationPlayState = 'running';
    bottle3d.style.transform = '';
  });

  heroScene.addEventListener('mousemove', (e) => {
    if (!isHovering) return;
    const rect = heroScene.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateY = x * 30;
    const rotateX = -y * 15;
    const translateY = y * -20;
    bottle3d.style.transform = `translateY(${translateY}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  });
}

// ===== 3D Tilt Effect on Cards (mouse devices only) =====
if (!isTouchDevice) {
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tiltX = (0.5 - y) * 20;
      const tiltY = (x - 0.5) * 20;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.03, 1.03, 1.03)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

// ===== Parallax on scroll for hero bubbles (skip on touch for performance) =====
if (!isTouchDevice) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach((bubble, i) => {
      const speed = 0.05 + (i * 0.02);
      bubble.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
}
