/**
 * Theme Toggle System
 * Manages dark/light theme with localStorage persistence across all pages
 */

// Initialize theme immediately on page load (before DOM renders)
(function initTheme() {
  // Get saved theme from localStorage, or check system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Determine which theme to apply
  const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  // Apply theme to html element
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();

/**
 * Toggle between dark and light themes
 * Saves preference to localStorage
 */
function toggleTheme() {
  const htmlElement = document.documentElement;
  const isDark = htmlElement.classList.contains('dark');
  
  if (isDark) {
    htmlElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    htmlElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
}

/**
 * Get current theme
 * @returns {string} 'dark' or 'light'
 */
function getCurrentTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/**
 * Set theme explicitly
 * @param {string} theme - 'dark' or 'light'
 */
function setTheme(theme) {
  const htmlElement = document.documentElement;
  
  if (theme === 'dark') {
    htmlElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    htmlElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

/**
 * Set theme to follow system preference
 * Removes manual preference and syncs with OS settings
 */
function setSystemTheme() {
  localStorage.removeItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (systemPrefersDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Listen for system theme changes (optional - updates theme if user changes system preference)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  // Only update if user hasn't set a manual preference
  if (!localStorage.getItem('theme')) {
    if (e.matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
});
