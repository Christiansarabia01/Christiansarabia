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

// 2. Canvas Particle Engine Removed (Background motion design disabled)

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
    // We let the natural download happen (href is set to assets/sword.glb)
    // But we trigger a cool console splash and micro-feedback!
    console.log("Downloading sword.glb source file...");
    
    const originalText = downloadBtn.innerHTML;
    
    // Smooth transition to Success state
    downloadBtn.style.transform = 'translateY(1px)';
    downloadBtn.style.opacity = '0.9';
    
    // Create a temporary success message
    downloadBtn.innerHTML = `
      <svg class="download-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: translateY(0px)">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Downloading 3D Model!
    `;
    
    setTimeout(() => {
      downloadBtn.style.transform = 'none';
      downloadBtn.style.opacity = '1';
      downloadBtn.innerHTML = originalText;
    }, 2000);
  });
}
