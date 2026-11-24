/* Vercel Web Analytics initialization
   This script loads and initializes Vercel Web Analytics for page view tracking.
   It runs after the DOM has loaded to ensure proper initialization. */

(function() {
  'use strict';
  
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return;
  
  // Initialize the analytics queue
  if (!window.va) {
    window.va = function() {
      (window.vaq = window.vaq || []).push(arguments);
    };
  }
  
  // Detect environment (production vs development)
  var mode = 'production';
  try {
    // Check if running on localhost or development domains
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('local')) {
      mode = 'development';
    }
  } catch (e) {
    // If there's any error, default to production
  }
  
  // Set the mode
  window.vam = mode;
  
  // Create and inject the analytics script
  var script = document.createElement('script');
  script.defer = true;
  
  // Use different script URLs for different environments
  if (mode === 'development') {
    script.src = 'https://va.vercel-scripts.com/v1/script.debug.js';
  } else {
    script.src = '/_vercel/insights/script.js';
  }
  
  // Add error handling
  script.onerror = function() {
    console.warn('Vercel Analytics: Failed to load analytics script');
  };
  
  // Inject the script into the page
  var firstScript = document.getElementsByTagName('script')[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }
  
  // Track initial page view
  if (window.va) {
    window.va('pageview', {
      route: window.location.pathname,
      path: window.location.pathname
    });
  }
})();
