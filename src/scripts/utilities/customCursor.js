/**
 * Custom Cursor for Desktop
 */

export function initCustomCursor() {
  // Only initialize on desktop
  if (window.innerWidth < 768) return;

  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');

  if (!cursorDot || !cursorOutline) return;

  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;

  // Update cursor position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows immediately
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Outline follows with delay
  function animateOutline() {
    const distX = mouseX - outlineX;
    const distY = mouseY - outlineY;

    outlineX += distX * 0.15;
    outlineY += distY * 0.15;

    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;

    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Expand on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .btn, [role="button"]');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
      cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursorOutline.style.borderColor = '#d4af37'; // brass
    });

    el.addEventListener('mouseleave', () => {
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorOutline.style.borderColor = '#d4af37';
    });
  });

  // Hide default cursor on body
  document.body.style.cursor = 'none';

  // Show cursors
  cursorDot.style.opacity = '1';
  cursorOutline.style.opacity = '1';
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomCursor);
} else {
  initCustomCursor();
}
