// =====================================================
// VOYAGO — script.js
// Features:
//  1. Login gate (name/phone/email, stored in localStorage)
//  2. Mobile hamburger menu toggle
//  3. Active nav link highlight
//  4. Scroll-reveal animation (IntersectionObserver)
//  5. FAQ accordion toggle
//  6. Booking form validation
// (Hero particles and the footer/contact email address are now
//  static HTML — see index.html / footers — for LLM & crawler
//  readability, not JS-injected.)
// =====================================================

document.addEventListener('DOMContentLoaded', function () {

    const loginScreen = document.getElementById('loginScreen');
  const loginForm = document.getElementById('loginForm');
  const accountChip = document.getElementById('accountChip');
  const savedUser = JSON.parse(localStorage.getItem('voyagoUser') || 'null');

  function unlockSite(user) {
    document.body.classList.remove('login-locked');
    if (loginScreen) loginScreen.classList.add('hide');
    if (accountChip && user && user.name) accountChip.textContent = user.name.split(' ')[0];
  }

  if (savedUser) unlockSite(savedUser);

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('loginName');
      const phone = document.getElementById('loginPhone');
      const email = document.getElementById('loginEmail');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phonePattern = /^[0-9]{10}$/;
      let valid = true;

      loginForm.querySelectorAll('.error-text').forEach(el => el.style.display = 'none');
      loginForm.querySelectorAll('input').forEach(el => el.style.borderColor = '');

      if (name.value.trim().length < 2) {
        showError(name, 'Please enter your full name.');
        valid = false;
      }

      if (!phonePattern.test(phone.value.trim())) {
        showError(phone, 'Please enter a valid 10-digit phone number.');
        valid = false;
      }

      if (!emailPattern.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address.');
        valid = false;
      }

      if (!valid) return;

      const user = {
        name: name.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim()
      };

      localStorage.setItem('voyagoUser', JSON.stringify(user));
      unlockSite(user);
    });
  }

  /* ─────────────────────────────────────────────────
     1. MOBILE MENU TOGGLE
     Clicking the hamburger button shows/hides nav
  ───────────────────────────────────────────────── */
  const toggleBtn = document.querySelector('.menu-toggle');
  const navLinks  = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', function () {
      navLinks.classList.toggle('show');
    });
    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('show'));
    });
  }

  /* ─────────────────────────────────────────────────
     2. ACTIVE NAV LINK
     Adds .active class to the link matching the page
  ───────────────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page'); // a11y: announce current page to screen readers
    } else {
      link.removeAttribute('aria-current');
    }
  });

  /* ─────────────────────────────────────────────────
     3. HERO FLOATING PARTICLES
     Now static markup in index.html (see .hero-particles),
     animated purely via CSS — no JS generation needed.
  ───────────────────────────────────────────────── */

  /* ─────────────────────────────────────────────────
     4. SCROLL REVEAL (IntersectionObserver)
     Elements with .reveal or .reveal-stagger animate
     in when they enter the viewport
  ───────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target); // Animate once only
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything immediately
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ─────────────────────────────────────────────────
     5. FAQ ACCORDION TOGGLE
     Clicking a question opens/closes its answer
  ───────────────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function () {
      const item = this.parentElement;
      // Close all others
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) other.classList.remove('open');
      });
      // Toggle this one
      item.classList.toggle('open');
    });
  });

  /* ─────────────────────────────────────────────────
     6. BOOKING FORM VALIDATION
     Validates name, email, phone, and message
     Shows per-field error text or success message
  ───────────────────────────────────────────────── */
  const form = document.getElementById('bookingForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Stop browser from refreshing the page

      let isValid = true;

      const name    = form.querySelector('#name');
      const email   = form.querySelector('#email');
      const phone   = form.querySelector('#phone');
      const message = form.querySelector('#message');

      // Clear all previous error messages first
      form.querySelectorAll('.error-text').forEach(el => el.style.display = 'none');
      form.querySelectorAll('input, textarea').forEach(el => el.style.borderColor = '');

      // --- Validate name (min 2 characters) ---
      if (name.value.trim().length < 2) {
        showError(name, 'Please enter your full name.');
        isValid = false;
      }

      // --- Validate email (standard pattern) ---
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address.');
        isValid = false;
      }

      // --- Validate phone (exactly 10 digits) ---
      const phonePattern = /^[0-9]{10}$/;
      if (!phonePattern.test(phone.value.trim())) {
        showError(phone, 'Please enter a valid 10-digit phone number.');
        isValid = false;
      }

      // --- Validate message (min 5 characters) ---
      if (message.value.trim().length < 5) {
        showError(message, 'Please enter a short message.');
        isValid = false;
      }

      // --- Show success or stop ---
      const successBox = document.querySelector('.form-success');
      if (isValid) {
        successBox.style.display = 'block';
        form.reset();
        // Auto-hide the success message after 5 seconds
        setTimeout(() => { successBox.style.display = 'none'; }, 5000);
      } else {
        if (successBox) successBox.style.display = 'none';
      }
    });
  }

  /* Helper: show error message below a field */
  function showError(field, message) {
    const errorEl = field.parentElement.querySelector('.error-text');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
    field.style.borderColor = '#fb7185'; // Red border on error
  }

}); // end DOMContentLoaded