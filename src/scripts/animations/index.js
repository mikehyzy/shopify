/**
 * GSAP Animations for Chicago Futures Salon Theme
 */

// Wait for GSAP to be loaded from CDN
function initAnimations() {
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded, retrying...');
    setTimeout(initAnimations, 100);
    return;
  }

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  // Initialize animations
  initScrollAnimations();
  initTextAnimations();
  initParallaxEffects();
  initHoverAnimations();
  initPageTransitions();

  console.log('GSAP animations initialized');
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
  // Fade in elements on scroll
  const fadeElements = document.querySelectorAll('[data-fade-in]');
  fadeElements.forEach((el, index) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
        // markers: true // Enable for debugging
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: index * 0.1,
      ease: 'power3.out'
    });
  });

  // Slide in from left
  const slideLeftElements = document.querySelectorAll('[data-slide-left]');
  slideLeftElements.forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      x: -50,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  // Slide in from right
  const slideRightElements = document.querySelectorAll('[data-slide-right]');
  slideRightElements.forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      x: 50,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  // Scale up animations
  const scaleElements = document.querySelectorAll('[data-scale-up]');
  scaleElements.forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      ease: 'back.out(1.2)'
    });
  });

  // Stagger animations for lists
  const staggerContainers = document.querySelectorAll('[data-stagger-children]');
  staggerContainers.forEach(container => {
    const children = container.children;
    gsap.from(children, {
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out'
    });
  });

  // Pin sections
  const pinSections = document.querySelectorAll('[data-pin-section]');
  pinSections.forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=500',
      pin: true,
      pinSpacing: true
    });
  });
}

/**
 * Text animations
 */
function initTextAnimations() {
  // Typewriter effect
  const typewriterElements = document.querySelectorAll('[data-typewriter]');
  typewriterElements.forEach(el => {
    const text = el.textContent;
    el.textContent = '';

    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(el, {
          duration: text.length * 0.05,
          text: text,
          ease: 'none'
        });
      },
      once: true
    });
  });

  // Split text reveal
  const splitTextElements = document.querySelectorAll('[data-split-text]');
  splitTextElements.forEach(el => {
    const text = el.textContent;
    const words = text.split(' ');

    el.innerHTML = words.map(word =>
      `<span class="inline-block overflow-hidden">
        <span class="inline-block transform translate-y-full">${word}</span>
      </span> `
    ).join('');

    const spans = el.querySelectorAll('span span');

    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(spans, {
          y: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power3.out'
        });
      },
      once: true
    });
  });

  // Gradient text animation
  const gradientTexts = document.querySelectorAll('.gradient-text');
  gradientTexts.forEach(el => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      backgroundPosition: '200% center',
      ease: 'none'
    });
  });
}

/**
 * Parallax effects
 */
function initParallaxEffects() {
  // Parallax backgrounds
  const parallaxBgs = document.querySelectorAll('[data-parallax-bg]');
  parallaxBgs.forEach(el => {
    const speed = parseFloat(el.dataset.parallaxBg) || 0.5;

    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: (i, target) => -ScrollTrigger.maxScroll(window) * speed,
      ease: 'none'
    });
  });

  // Parallax images
  const parallaxImages = document.querySelectorAll('[data-parallax-image]');
  parallaxImages.forEach(el => {
    const speed = parseFloat(el.dataset.parallaxImage) || 0.3;

    gsap.to(el, {
      scrollTrigger: {
        trigger: el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: `${speed * 100}%`,
      ease: 'none'
    });
  });
}

/**
 * Hover animations
 */
function initHoverAnimations() {
  // Magnetic buttons
  const magneticButtons = document.querySelectorAll('[data-magnetic]');
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });

  // Hover lift effect
  const liftElements = document.querySelectorAll('[data-hover-lift]');
  liftElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(el, {
        y: -10,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
}

/**
 * Page transitions
 */
function initPageTransitions() {
  // Fade in page on load
  gsap.from('body', {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out'
  });

  // Smooth page exit (if using AJAX navigation)
  const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([data-no-transition])');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.hostname === window.location.hostname) {
        const href = link.href;

        // Only animate if not opening in new tab
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();

          gsap.to('body', {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
              window.location.href = href;
            }
          });
        }
      }
    });
  });
}

/**
 * Utility: Create infinite loop animation
 */
window.createInfiniteLoop = function(element, properties, duration = 10) {
  gsap.to(element, {
    ...properties,
    duration: duration,
    repeat: -1,
    ease: 'none'
  });
};

/**
 * Utility: Create morphing animation
 */
window.createMorphingShape = function(element, targetPath, duration = 2) {
  if (typeof MorphSVGPlugin !== 'undefined') {
    gsap.to(element, {
      morphSVG: targetPath,
      duration: duration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }
};

/**
 * Utility: Animate counter
 */
window.animateCounter = function(element, endValue, duration = 2) {
  const startValue = 0;
  const obj = { value: startValue };

  gsap.to(obj, {
    value: endValue,
    duration: duration,
    ease: 'power2.out',
    onUpdate: function() {
      element.textContent = Math.round(obj.value);
    }
  });
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}

// Re-initialize on AJAX page loads (if applicable)
document.addEventListener('shopify:section:load', initAnimations);

export {
  initScrollAnimations,
  initTextAnimations,
  initParallaxEffects,
  initHoverAnimations
};
