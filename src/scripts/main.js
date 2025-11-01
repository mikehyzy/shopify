/**
 * Chicago Futures Salon Theme
 * Main JavaScript Entry Point
 */

import './utilities/smoothScroll';
import './utilities/lazyLoad';
import './utilities/customCursor';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Chicago Futures Salon theme initialized');

  // Initialize theme features
  initTheme();
  initCart();
  initSearch();
  initAccessibility();
});

/**
 * Initialize theme features
 */
function initTheme() {
  // Add custom class to HTML element
  document.documentElement.classList.add('theme-loaded');

  // Handle external links
  const externalLinks = document.querySelectorAll('a[href^="http"]');
  externalLinks.forEach(link => {
    if (!link.href.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  // Prevent layout shift on images
  const images = document.querySelectorAll('img:not([width]):not([height])');
  images.forEach(img => {
    img.addEventListener('load', function() {
      this.style.aspectRatio = `${this.naturalWidth} / ${this.naturalHeight}`;
    });
  });
}

/**
 * Cart functionality
 */
function initCart() {
  // Update cart count on page load
  updateCartCount();

  // Listen for cart updates
  document.addEventListener('cart:updated', updateCartCount);
}

async function updateCartCount() {
  try {
    const response = await fetch('/cart.js');
    const cart = await response.json();

    // Update all cart count elements
    const cartCountElements = document.querySelectorAll('[data-cart-count]');
    cartCountElements.forEach(el => {
      el.textContent = cart.item_count;
      if (cart.item_count > 0) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });

  } catch (error) {
    console.error('Error fetching cart:', error);
  }
}

/**
 * Search functionality
 */
function initSearch() {
  const searchToggle = document.querySelector('[data-search-toggle]');
  const searchOverlay = document.querySelector('[data-search-overlay]');
  const searchInput = document.querySelector('[data-search-input]');

  if (!searchToggle || !searchOverlay || !searchInput) return;

  searchToggle.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    setTimeout(() => searchInput.focus(), 100);
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
      searchOverlay.classList.remove('active');
    }
  });

  // Predictive search
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      performSearch(e.target.value);
    }, 300);
  });
}

async function performSearch(query) {
  if (!query || query.length < 2) return;

  try {
    const response = await fetch(
      `${window.theme.routes.predictive_search_url}?q=${encodeURIComponent(query)}&resources[type]=product,article&resources[limit]=5`
    );
    const results = await response.json();

    displaySearchResults(results);

  } catch (error) {
    console.error('Search error:', error);
  }
}

function displaySearchResults(results) {
  const resultsContainer = document.querySelector('[data-search-results]');
  if (!resultsContainer) return;

  let html = '';

  if (results.resources.results.products.length === 0) {
    html = '<p class="text-chicago-grey p-4">No results found</p>';
  } else {
    html = '<ul class="divide-y divide-brass/20">';
    results.resources.results.products.forEach(product => {
      html += `
        <li class="p-4 hover:bg-brass/10 transition-colors">
          <a href="${product.url}" class="flex items-center space-x-4">
            ${product.image ? `<img src="${product.image}" alt="${product.title}" class="w-16 h-16 object-cover rounded">` : ''}
            <div class="flex-1">
              <h4 class="font-heading font-semibold">${product.title}</h4>
              <p class="text-sm text-brass">${formatMoney(product.price)}</p>
            </div>
          </a>
        </li>
      `;
    });
    html += '</ul>';
  }

  resultsContainer.innerHTML = html;
}

/**
 * Format money according to shop settings
 */
function formatMoney(cents) {
  const amount = (cents / 100).toFixed(2);
  return window.theme.moneyFormat.replace('{{amount}}', amount);
}

/**
 * Accessibility features
 */
function initAccessibility() {
  // Skip to content link
  const skipLink = document.querySelector('.skip-to-content-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href'));
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Announce dynamic content changes to screen readers
  window.announceToScreenReader = function(message) {
    const announcer = document.getElementById('a11y-announcer');
    if (announcer) {
      announcer.textContent = message;
      setTimeout(() => {
        announcer.textContent = '';
      }, 3000);
    }
  };

  // Trap focus in modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const activeModal = document.querySelector('.modal.active, [role="dialog"][aria-modal="true"]');
      if (activeModal) {
        trapFocus(activeModal, e);
      }
    }
  });
}

function trapFocus(element, event) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstFocusable) {
    lastFocusable.focus();
    event.preventDefault();
  } else if (!event.shiftKey && document.activeElement === lastFocusable) {
    firstFocusable.focus();
    event.preventDefault();
  }
}

/**
 * Utility: Debounce function
 */
window.debounce = function(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Utility: Throttle function
 */
window.throttle = function(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Export for use in other modules
export {
  formatMoney,
  updateCartCount
};
