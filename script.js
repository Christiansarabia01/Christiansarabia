// Advanced smooth scrolling effect for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Intersection Observer for scroll animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in-up').forEach((el) => {
  observer.observe(el);
});

console.log("Welcome to Christian Sarabia's Portfolio!");

// ==========================================
// PREMIUM INTERACTIVITY ENHANCEMENTS
// ==========================================

// 1. Theme Toggle (Light/Dark Mode)
const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = themeToggleBtn.querySelector('.sun-icon');
const moonIcon = themeToggleBtn.querySelector('.moon-icon');

function setTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  } else {
    document.body.classList.remove('dark-theme');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  }
  localStorage.setItem('portfolio-theme', theme);
}

// Initialize theme
const storedTheme = localStorage.getItem('portfolio-theme');
if (storedTheme) {
  setTheme(storedTheme);
} else {
  setTheme('light'); // Light blue is now the absolute default overall theme
}

themeToggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-theme');
  setTheme(isDark ? 'light' : 'dark');
});

// 2. Canvas Particle Engine
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
const heroSection = document.getElementById('hero');

let particles = [];
let mouse = { x: null, y: null, radius: 120 };

function resizeCanvas() {
  if (!canvas || !heroSection) return;
  canvas.width = heroSection.offsetWidth;
  canvas.height = heroSection.offsetHeight;
  initParticles();
}

window.addEventListener('resize', resizeCanvas);

heroSection.addEventListener('mousemove', (e) => {
  const rect = heroSection.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

heroSection.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
  }
  
  draw() {
    const isDark = document.body.classList.contains('dark-theme');
    ctx.fillStyle = isDark ? 'rgba(91, 192, 190, 0.55)' : 'rgba(0, 119, 182, 0.45)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
    if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

    if (mouse.x !== null && mouse.y !== null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouse.radius) {
        let force = (mouse.radius - distance) / mouse.radius;
        let directionX = dx / distance;
        let directionY = dy / distance;
        
        this.x -= directionX * force * 5;
        this.y -= directionY * force * 5;
      }
    }
  }
}

function initParticles() {
  particles = [];
  const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 11000), 120);
  for (let i = 0; i < numberOfParticles; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  connectParticles();
  requestAnimationFrame(animateParticles);
}

function connectParticles() {
  const maxDistance = 110;
  const isDark = document.body.classList.contains('dark-theme');
  const strokeColor = isDark ? 'rgba(91, 192, 190, ' : 'rgba(0, 119, 182, ';
  
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < maxDistance) {
        let alpha = (1 - (distance / maxDistance)) * 0.15;
        ctx.strokeStyle = strokeColor + alpha + ')';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

// Initial fire of canvas scaling & loop
resizeCanvas();
animateParticles();

// 3. 3D Tilt Card and Hover Glow Effect
const cards = document.querySelectorAll('.project-card');

cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    
    const cardWidth = rect.width;
    const cardHeight = rect.height;
    const centerX = cardWidth / 2;
    const centerY = cardHeight / 2;
    
    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = ((centerY - y) / centerY) * 8;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
});

// 4. Interactive Skill Filtering for Projects
const skillTags = document.querySelectorAll('.skill-tag');
const projectCards = document.querySelectorAll('.project-card');

skillTags.forEach(tag => {
  tag.addEventListener('click', () => {
    const skill = tag.getAttribute('data-skill');
    const isActive = tag.classList.contains('active');
    
    skillTags.forEach(t => t.classList.remove('active'));
    
    if (!isActive) {
      tag.classList.add('active');
      
      projectCards.forEach(card => {
        const cardSkills = card.getAttribute('data-skills').split(' ');
        if (cardSkills.includes(skill)) {
          card.classList.remove('filtered-out');
        } else {
          card.classList.add('filtered-out');
        }
      });
    } else {
      projectCards.forEach(card => card.classList.remove('filtered-out'));
    }
  });
});

// ==========================================
// 3D MODEL VIEWER CONTROLLER LOGIC
// ==========================================

const modelViewer = document.getElementById('portfolio-model-viewer');
const toggleRotateBtn = document.getElementById('toggle-rotate-btn');
const expButtons = document.querySelectorAll('.exposure-buttons .control-btn');
const downloadBtn = document.getElementById('blend-download-link');

// 1. Toggle Auto-Rotation
if (toggleRotateBtn && modelViewer) {
  toggleRotateBtn.addEventListener('click', () => {
    const isRotating = modelViewer.hasAttribute('auto-rotate');
    
    if (isRotating) {
      modelViewer.removeAttribute('auto-rotate');
      toggleRotateBtn.classList.remove('active');
      toggleRotateBtn.textContent = 'OFF';
    } else {
      modelViewer.setAttribute('auto-rotate', '');
      toggleRotateBtn.classList.add('active');
      toggleRotateBtn.textContent = 'ON';
    }
  });
}

// 2. Adjust Lighting Exposure
if (expButtons.length > 0 && modelViewer) {
  expButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const expValue = parseFloat(btn.getAttribute('data-exp'));
      
      // Update Model Viewer Exposure
      modelViewer.setAttribute('exposure', expValue);
      
      // Toggle Active States
      expButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Subtle scale feedback on click
      btn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        btn.style.transform = 'none';
      }, 100);
    });
  });
}

// 3. Download Micro-Animation Feedback
if (downloadBtn) {
  downloadBtn.addEventListener('click', (e) => {
    // We let the natural download happen (href is set to assets/A2 3D Model.blend)
    // But we trigger a cool console splash and micro-feedback!
    console.log("Downloading A2 3D Model.blend source file...");
    
    const originalText = downloadBtn.innerHTML;
    
    // Smooth transition to Success state
    downloadBtn.style.transform = 'translateY(1px)';
    downloadBtn.style.opacity = '0.9';
    
    // Create a temporary success message
    downloadBtn.innerHTML = `
      <svg class="download-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: translateY(0px)">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Downloading Blender Source!
    `;
    
    setTimeout(() => {
      downloadBtn.style.transform = 'none';
      downloadBtn.style.opacity = '1';
      downloadBtn.innerHTML = originalText;
    }, 2000);
  });
}
