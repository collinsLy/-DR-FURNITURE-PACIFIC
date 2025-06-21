
// Toast notification system
class ToastManager {
  constructor() {
    this.createToastContainer();
  }

  createToastContainer() {
    // Check if container already exists
    if (document.getElementById('toast-container')) {
      return;
    }

    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }

  showToast(message, type = 'info', duration = 5000) {
    const toastId = 'toast-' + Date.now();
    const iconMap = {
      'success': '✓',
      'error': '✕',
      'warning': '⚠',
      'info': 'ℹ'
    };

    const colorMap = {
      'success': 'text-bg-success',
      'error': 'text-bg-danger',
      'warning': 'text-bg-warning',
      'info': 'text-bg-primary'
    };

    const toastHTML = `
      <div id="${toastId}" class="toast ${colorMap[type]}" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="${duration}">
        <div class="toast-header">
          <span class="me-2">${iconMap[type]}</span>
          <strong class="me-auto">DR FURNITURE PACIFIC</strong>
          <small class="text-muted">Just now</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body text-white">
          ${message}
        </div>
      </div>
    `;

    const container = document.getElementById('toast-container');
    container.insertAdjacentHTML('beforeend', toastHTML);

    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    
    // Show the toast
    toast.show();

    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove();
    });

    return toast;
  }

  // Convenience methods
  success(message, duration = 5000) {
    return this.showToast(message, 'success', duration);
  }

  error(message, duration = 5000) {
    return this.showToast(message, 'error', duration);
  }

  warning(message, duration = 5000) {
    return this.showToast(message, 'warning', duration);
  }

  info(message, duration = 5000) {
    return this.showToast(message, 'info', duration);
  }
}

// Initialize toast manager
const toastManager = new ToastManager();

// Make it globally available
window.showToast = (message, type, duration) => toastManager.showToast(message, type, duration);
window.toastSuccess = (message, duration) => toastManager.success(message, duration);
window.toastError = (message, duration) => toastManager.error(message, duration);
window.toastWarning = (message, duration) => toastManager.warning(message, duration);
window.toastInfo = (message, duration) => toastManager.info(message, duration);
