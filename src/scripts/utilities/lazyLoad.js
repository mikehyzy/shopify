/**
 * Lazy Loading Images with Intersection Observer
 */

export function initLazyLoad() {
  // Check for Intersection Observer support
  if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver not supported');
    return;
  }

  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;

        // Load the image
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }

        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }

        // Remove lazy class and add loaded class
        img.classList.remove('lazy');
        img.classList.add('lazy-loaded');

        // Stop observing this image
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px' // Start loading 50px before entering viewport
  });

  lazyImages.forEach(img => imageObserver.observe(img));

  // Also handle background images
  const lazyBackgrounds = document.querySelectorAll('[data-lazy-bg]');

  const bgObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.backgroundImage = `url('${el.dataset.lazyBg}')`;
        el.classList.add('lazy-loaded');
        observer.unobserve(el);
      }
    });
  }, {
    rootMargin: '50px'
  });

  lazyBackgrounds.forEach(el => bgObserver.observe(el));
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLazyLoad);
} else {
  initLazyLoad();
}
