/**
 * Custom Notification System for Linkly
 * Matches the project's design system with dark/light theme support
 */

// Notification container management
let notificationContainer = null;

/**
 * Initialize notification container
 */
function initNotificationContainer() {
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    notificationContainer.className = 'fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-md';
    document.body.appendChild(notificationContainer);
  }
}

/**
 * Show a notification toast
 * @param {string} message - The message to display
 * @param {string} type - Type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in ms (0 = permanent until clicked)
 */
function showNotification(message, type = 'info', duration = 4000) {
  initNotificationContainer();

  const notification = document.createElement('div');
  notification.className = `notification-toast flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-sm transform transition-all duration-300 translate-x-[400px] opacity-0 ${getNotificationStyles(type)}`;
  
  const icon = getNotificationIcon(type);
  
  notification.innerHTML = `
    <div class="flex-shrink-0">
      <span class="material-symbols-outlined text-2xl">${icon}</span>
    </div>
    <div class="flex-1 pt-0.5">
      <p class="text-sm font-medium leading-snug">${message}</p>
    </div>
    <button 
      onclick="this.parentElement.remove()" 
      class="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
    >
      <span class="material-symbols-outlined text-xl">close</span>
    </button>
  `;

  notificationContainer.appendChild(notification);

  // Trigger animation
  setTimeout(() => {
    notification.classList.remove('translate-x-[400px]', 'opacity-0');
  }, 10);

  // Auto remove after duration
  if (duration > 0) {
    setTimeout(() => {
      notification.classList.add('translate-x-[400px]', 'opacity-0');
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }

  return notification;
}

/**
 * Get notification styling based on type
 */
function getNotificationStyles(type) {
  const styles = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
  };
  return styles[type] || styles.info;
}

/**
 * Get icon based on notification type
 */
function getNotificationIcon(type) {
  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info'
  };
  return icons[type] || icons.info;
}

/**
 * Show custom confirmation dialog
 * @param {string} message - The confirmation message
 * @param {string} title - Dialog title
 * @param {Function} onConfirm - Callback when confirmed
 * @param {Function} onCancel - Callback when cancelled
 */
function showConfirmDialog(message, title = 'Confirm Action', onConfirm, onCancel) {
  const dialog = document.createElement('div');
  dialog.id = 'confirm-dialog';
  dialog.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-fade-in';
  
  dialog.innerHTML = `
    <div class="bg-card-light dark:bg-card-dark rounded-2xl shadow-2xl w-full max-w-md transform transition-all scale-95 animate-scale-in">
      <!-- Dialog Header -->
      <div class="flex items-start gap-3 p-6 border-b border-border-light dark:border-border-dark">
        <div class="flex-shrink-0 flex items-center justify-center size-12 rounded-full bg-red-100 dark:bg-red-900/30">
          <span class="material-symbols-outlined text-red-600 dark:text-red-400 text-2xl">help</span>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-bold text-text-light dark:text-text-dark">${title}</h3>
          <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">${message}</p>
        </div>
      </div>
      
      <!-- Dialog Actions -->
      <div class="flex gap-3 p-6">
        <button
          id="confirm-cancel"
          class="flex-1 px-4 py-3 rounded-lg border border-border-light dark:border-border-dark text-text-light dark:text-text-dark font-medium hover:bg-border-light dark:hover:bg-border-dark transition-colors"
        >
          Cancel
        </button>
        <button
          id="confirm-accept"
          class="flex-1 px-4 py-3 rounded-lg bg-red-600 dark:bg-red-500 text-white font-medium hover:bg-red-700 dark:hover:bg-red-600 transition-colors shadow-sm"
        >
          Confirm
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);
  document.body.style.overflow = 'hidden';

  // Handle cancel
  const cancelBtn = dialog.querySelector('#confirm-cancel');
  const acceptBtn = dialog.querySelector('#confirm-accept');

  const closeDialog = () => {
    dialog.classList.add('animate-fade-out');
    setTimeout(() => {
      dialog.remove();
      document.body.style.overflow = 'auto';
    }, 200);
  };

  cancelBtn.addEventListener('click', () => {
    closeDialog();
    if (onCancel) onCancel();
  });

  // Handle confirm
  acceptBtn.addEventListener('click', () => {
    closeDialog();
    if (onConfirm) onConfirm();
  });

  // Close on backdrop click
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      closeDialog();
      if (onCancel) onCancel();
    }
  });

  // Close on Escape key
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeDialog();
      if (onCancel) onCancel();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  // Focus on cancel button
  setTimeout(() => acceptBtn.focus(), 100);
}

/**
 * Convenience methods
 */
const notify = {
  success: (message, duration) => showNotification(message, 'success', duration),
  error: (message, duration) => showNotification(message, 'error', duration),
  warning: (message, duration) => showNotification(message, 'warning', duration),
  info: (message, duration) => showNotification(message, 'info', duration),
};
