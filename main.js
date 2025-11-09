// Theme Toggle
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  document.getElementById('theme-icon').textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  setTimeout(() => {
    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }, 100);
}

function createThemeToggle() {
  const btn = document.createElement('button');
  btn.className = 'theme-toggle';
  btn.id = 'theme-toggle';
  btn.setAttribute('aria-label', 'تبديل الوضع المظلم/الفا');
  const icon = document.createElement('span');
  icon.id = 'theme-icon';
  icon.textContent = '☀️';
  btn.appendChild(icon);
  document.body.appendChild(btn);
  btn.addEventListener('click', toggleTheme);
}

// Hamburger & Particles & Dynamic Images
document.addEventListener('DOMContentLoaded', () => {
  createThemeToggle();
  initTheme();

  // Hamburger
  const ham = document.getElementById('hamburger');
  const nav = document.querySelector('nav');
  if (ham && nav) {
    ham.addEventListener('click', () => {
      nav.classList.toggle('mobile-open');
      const s = ham.querySelectorAll('span');
      if (nav.classList.contains('mobile-open')) {
        s[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        s[1].style.opacity = '0';
        s[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        s[0].style.transform = 'rotate(0)';
        s[1].style.opacity = '1';
        s[2].style.transform = 'rotate(0)';
      }
    });

    document.querySelectorAll('nav a').forEach(a => {
      a.addEventListener('click', () => {
        if (window.innerWidth <= 600 && nav.classList.contains('mobile-open')) {
          nav.classList.remove('mobile-open');
          const s = ham.querySelectorAll('span');
          s[0].style.transform = 'rotate(0)';
          s[1].style.opacity = '1';
          s[2].style.transform = 'rotate(0)';
        }
      });
    });
  }

  // Scroll Animations
  const cards = document.querySelectorAll('.card');
  if (cards.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting && e.target.classList.add('show'));
    }, { threshold: 0.1 });
    cards.forEach(c => obs.observe(c));
  }

  // ✅ تحديث الصور الديناميكية (في slides.html و team.html)
  document.querySelectorAll('.dynamic-img').forEach(img => {
    const keywords = img.dataset.keywords || 'education';
    const timestamp = Date.now() + Math.random() * 1000;
    const newSrc = `https://source.unsplash.com/600x400/?${keywords}&t=${timestamp}`;
    img.src = newSrc;
  });

  // Canvas Particles
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const count = Math.min(50, Math.floor(window.innerWidth / 20));

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
      }
      draw() {
        const theme = document.documentElement.getAttribute('data-theme');
        const color = theme === 'dark' 
          ? 'rgba(0, 255, 170, 0.1)' 
          : 'rgba(13, 150, 98, 0.1)';
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < count; i++) particles.push(new Particle());

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    }
    animate();
  }
});