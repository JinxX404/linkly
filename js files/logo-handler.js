/**
 * Logo Handler for Linkly
 * Automatically fetches logos for links using Clearbit API with fallback to default
 */

// Default Linkly logo SVG (encoded as data URL)
const DEFAULT_LOGO = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366F1'%3E%3Cpath d='M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z'/%3E%3C/svg%3E`;

/**
 * Extract domain from URL
 * @param {string} url - The full URL
 * @returns {string} - The domain name
 */
function extractDomain(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch (e) {
        return '';
    }
}

/**
 * Create logo HTML with error handling
 * @param {string} name - Link name
 * @param {string} url - Link URL
 * @param {string} size - Tailwind size class (e.g., 'size-10')
 * @returns {string} - HTML string for logo
 */
function createLogoHTML(name, url, size = 'size-10') {
    const domain = extractDomain(url);
    const clearbitUrl = domain ? `https://logo.clearbit.com/${domain}` : DEFAULT_LOGO;
    
    // Escape single quotes in DEFAULT_LOGO for inline event handler
    const escapedDefaultLogo = DEFAULT_LOGO.replace(/'/g, "\\'");
    
    return `
        <div class="flex items-center justify-center ${size} rounded-md bg-primary-light/10 dark:bg-primary-dark/10 overflow-hidden flex-shrink-0">
            <img
                src="${clearbitUrl}"
                alt="${name} logo"
                class="w-full h-full object-contain p-2"
                onerror="if(this.src !== '${escapedDefaultLogo}') { this.onerror=null; this.src='${escapedDefaultLogo}'; }"
                onload="if(this.src !== '${escapedDefaultLogo}') { this.parentElement.classList.remove('bg-primary-light/10', 'dark:bg-primary-dark/10'); this.classList.remove('p-2'); this.classList.add('object-cover'); }"
            />
        </div>
    `;
}

