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

if (carousel && prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });
}

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
/* ============================================
   VELAVAH HERO - Funky Fresh Interactions
   Matching "Why We Rock" & "Pairings" Style
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  initFunkyAnimations();
  initBottleInteraction();
  initStatsCounter();
  initParallaxShapes();
  initAboutInteractions();
  initFAQAccordion();
});

// === Funky On-Load Animations ===
function initFunkyAnimations() {
  const elements = document.querySelectorAll('.hero-funky-content > *');

  elements.forEach((el, index) => {
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';

      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 50);
    }, index * 100);
  });

  // Animate visual
  const visual = document.querySelector('.hero-funky-visual');
  if (visual) {
    setTimeout(() => {
      visual.style.opacity = '0';
      visual.style.transform = 'scale(0.8) rotate(-10deg)';
      visual.style.transition = 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)';

      setTimeout(() => {
        visual.style.opacity = '1';
        visual.style.transform = 'scale(1) rotate(0deg)';
      }, 50);
    }, 300);
  }
}

// === Bottle Tilt Interaction ===
function initBottleInteraction() {
  const bottleCard = document.querySelector('.hero-bottle-card');
  const bottleImg = document.querySelector('.hero-bottle-img');

  if (!bottleCard || !bottleImg) return;

  bottleCard.addEventListener('mousemove', (e) => {
    const rect = bottleCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    bottleImg.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  bottleCard.addEventListener('mouseleave', () => {
    bottleImg.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  });

  // Click to spin
  bottleImg.addEventListener('click', () => {
    bottleImg.style.animation = 'none';
    setTimeout(() => {
      bottleImg.style.animation = 'bottleSpin 1s ease-out';
    }, 10);
  });

  // Add spin animation
  const spinStyles = document.createElement('style');
  spinStyles.textContent = `
    @keyframes bottleSpin {
      0% { transform: perspective(1000px) rotateY(0deg); }
      100% { transform: perspective(1000px) rotateY(360deg); }
    }
  `;
  document.head.appendChild(spinStyles);
}

// === Animated Stats Counter ===
function initStatsCounter() {
  const stats = document.querySelectorAll('.mini-stat-num');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;

        stats.forEach(stat => {
          const text = stat.textContent;

          // Skip if not a number
          if (text === 'CO₂' || text === 'MAX') return;

          const number = parseInt(text.replace(/\D/g, ''));
          if (isNaN(number)) return;

          let count = 0;
          const duration = 1500;
          const increment = number / (duration / 16);

          const counter = setInterval(() => {
            count += increment;
            if (count >= number) {
              stat.textContent = text;
              clearInterval(counter);
            } else {
              stat.textContent = Math.floor(count) + '+';
            }
          }, 16);
        });
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
}

// === Parallax Background Shapes ===
function initParallaxShapes() {
  const shapes = document.querySelectorAll('.funky-shape');

  if (shapes.length === 0) return;

  document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const xPercent = (clientX / window.innerWidth - 0.5) * 2;
    const yPercent = (clientY / window.innerHeight - 0.5) * 2;

    shapes.forEach((shape, index) => {
      const speed = (index + 1) * 3;
      const x = xPercent * speed;
      const y = yPercent * speed;

      shape.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
}

// === About Section Interactions ===
function initAboutInteractions() {
  // Photo card tilt effect
  const photoCard = document.querySelector('.about-photo-card');
  const aboutImg = document.querySelector('.about-img');

  if (photoCard && aboutImg) {
    photoCard.addEventListener('mousemove', (e) => {
      const rect = photoCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      photoCard.style.transform = `rotate(-2deg) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    photoCard.addEventListener('mouseleave', () => {
      photoCard.style.transform = 'rotate(-2deg) perspective(1000px) rotateX(0) rotateY(0)';
    });
  }

  // About stickers click effect
  const aboutStickers = document.querySelectorAll('.about-sticker');
  aboutStickers.forEach(sticker => {
    sticker.addEventListener('click', () => {
      sticker.style.animation = 'none';
      setTimeout(() => {
        sticker.style.animation = 'stickerPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      }, 10);
    });
  });

  // Feature cards hover animation
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
      const rotation = index % 2 === 0 ? -2 : 2;
      card.style.animation = `cardWiggle${rotation} 0.5s ease`;
    });

    card.addEventListener('animationend', () => {
      card.style.animation = '';
    });
  });

  // Story cards scroll animation
  const storyCards = document.querySelectorAll('.about-story-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(30px)';
          entry.target.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';

          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, 50);
        }, index * 150);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  storyCards.forEach(card => observer.observe(card));
}

// === Button Wiggle on Hover ===
const funkyButtons = document.querySelectorAll('.btn-funky');
funkyButtons.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.style.animation = 'buttonWiggle 0.5s ease';
  });

  btn.addEventListener('animationend', () => {
    btn.style.animation = '';
  });
});

// Add button wiggle animation
const buttonStyles = document.createElement('style');
buttonStyles.textContent = `
  @keyframes buttonWiggle {
    0%, 100% { transform: rotate(0deg) translateY(0); }
    25% { transform: rotate(-2deg) translateY(-2px); }
    75% { transform: rotate(2deg) translateY(-2px); }
  }
`;
document.head.appendChild(buttonStyles);

// === Sticker Click Effects ===
const stickers = document.querySelectorAll('.floating-sticker, .hero-sticker-badge');
stickers.forEach(sticker => {
  sticker.addEventListener('click', () => {
    sticker.style.animation = 'none';
    setTimeout(() => {
      sticker.style.animation = 'stickerPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }, 10);
  });
});

// Add sticker pop animation
const stickerStyles = document.createElement('style');
stickerStyles.textContent = `
  @keyframes stickerPop {
    0% { transform: scale(1); }
    50% { transform: scale(1.3) rotate(10deg); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(stickerStyles);

// === Mini Stats Hover Effects ===
const miniStats = document.querySelectorAll('.mini-stat');
miniStats.forEach(stat => {
  stat.addEventListener('mouseenter', () => {
    stat.style.animation = 'statBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
  });

  stat.addEventListener('animationend', () => {
    stat.style.animation = '';
  });
});

// Add stat bounce animation
const statStyles = document.createElement('style');
statStyles.textContent = `
  @keyframes statBounce {
    0%, 100% { transform: rotate(-1deg) translateY(0); }
    50% { transform: rotate(-1deg) translateY(-10px) scale(1.05); }
  }
`;
document.head.appendChild(statStyles);


// Add card wiggle animations
const cardWiggleStyles = document.createElement('style');
cardWiggleStyles.textContent = `
  @keyframes cardWiggle-2 {
    0%, 100% { transform: translateY(-6px) rotate(-2deg); }
    50% { transform: translateY(-6px) rotate(-4deg) scale(1.05); }
  }

  @keyframes cardWiggle2 {
    0%, 100% { transform: translateY(-6px) rotate(-2deg); }
    50% { transform: translateY(-6px) rotate(0deg) scale(1.05); }
  }
`;
document.head.appendChild(cardWiggleStyles);

// === FAQ Accordion ===
function initFAQAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const card = question.closest('.faq-card');
      const isOpen = card.classList.contains('open');

      // Close all other cards
      document.querySelectorAll('.faq-card').forEach(c => {
        if (c !== card) {
          c.classList.remove('open');
          c.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current card
      if (isOpen) {
        card.classList.remove('open');
        question.setAttribute('aria-expanded', 'false');
      } else {
        card.classList.add('open');
        question.setAttribute('aria-expanded', 'true');

        // Smooth scroll to card
        setTimeout(() => {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    });
  });

  // Scroll animation for FAQ cards
  const faqCards = document.querySelectorAll('.faq-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(40px) rotate(0deg)';
          entry.target.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';

          setTimeout(() => {
            entry.target.style.opacity = '1';
            const rotation = entry.target.classList.contains('card-orange') ||
                            entry.target.classList.contains('card-green') ? '1deg' :
                            entry.target.classList.contains('card-yellow') ||
                            entry.target.classList.contains('card-pink') ? '-2deg' :
                            entry.target.classList.contains('card-blue') ? '-1.5deg' : '-1deg';
            entry.target.style.transform = `translateY(0) rotate(${rotation})`;
          }, 50);
        }, index * 100);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  faqCards.forEach(card => observer.observe(card));
}

// === Console Easter Egg ===
console.log('%c🥤 VELAVAH GOLI SODA - FUNKY FRESH! 🥤',
  'font-size: 20px; font-weight: bold; background: linear-gradient(135deg, #c62828, #e65100, #fbbf24); color: #fff; padding: 10px 20px; border-radius: 8px;'
);
console.log('%c🎉 Built with Maximum Fizz Energy!',
  'font-size: 14px; color: #ff5252; font-family: Impact, sans-serif;'
);
console.log('%c💫 Click on stickers and the bottle for surprises!',
  'font-size: 12px; color: #10b981;'
);
/* ============================================
   VELAVAH UI FIXES - Essential JavaScript
   ============================================ */

(function() {
  'use strict';

  // === FIX SMOOTH SCROLLING FOR ANCHOR LINKS ===
  function fixAnchorScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const navbar = document.querySelector('.navbar');
          const topbar = document.querySelector('.topbar');
          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          const topbarHeight = topbar ? topbar.offsetHeight : 0;
          const offset = navbarHeight + topbarHeight + 20;

          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // === CLOSE MOBILE MENU ON LINK CLICK ===
  function fixMobileMenu() {
    const navLinkItems = document.querySelectorAll('.nav-links a');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (!hamburger || !navLinks) return;

    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
          hamburger.classList.remove('active');
          navLinks.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
  }

  // === CLOSE MENU ON ESCAPE KEY ===
  function handleEscapeKey() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');

        if (hamburger && navLinks && navLinks.classList.contains('active')) {
          hamburger.classList.remove('active');
          navLinks.classList.remove('active');
          document.body.style.overflow = '';
        }

        // Close open FAQ
        const openFAQ = document.querySelector('.faq-card.open');
        if (openFAQ) {
          openFAQ.classList.remove('open');
          const question = openFAQ.querySelector('.faq-question');
          if (question) {
            question.setAttribute('aria-expanded', 'false');
          }
        }
      }
    });
  }

  // === RESET MOBILE MENU ON RESIZE ===
  function handleResize() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 968) {
          const hamburger = document.getElementById('hamburger');
          const navLinks = document.getElementById('navLinks');
          if (hamburger && navLinks) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
          }
        }
      }, 250);
    });
  }

  // === INITIALIZE ALL FIXES ===
  function init() {
    fixAnchorScrolling();
    fixMobileMenu();
    handleEscapeKey();
    handleResize();

    console.log('%c✅ UI Fixes Applied',
      'color: #10b981; font-weight: bold; font-size: 12px;'
    );
  }

  // === RUN ON DOM READY ===
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
