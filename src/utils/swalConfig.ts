import Swal from "sweetalert2";

// Enhanced dark theme configuration for SweetAlert2
const darkThemeConfig = {
  background: '#1f2937', // Updated to match surface-elevated
  color: '#ffffff',
  confirmButtonColor: '#137fec', // Primary color
  cancelButtonColor: '#6b7280',
  denyButtonColor: '#ef4444', // Error color
  customClass: {
    popup: 'enhanced-swal-popup',
    title: 'enhanced-swal-title',
    htmlContainer: 'enhanced-swal-content',
    confirmButton: 'enhanced-swal-confirm-btn',
    cancelButton: 'enhanced-swal-cancel-btn',
    denyButton: 'enhanced-swal-deny-btn',
    actions: 'enhanced-swal-actions',
    timerProgressBar: 'enhanced-swal-progress',
  },
  showClass: {
    popup: 'animate-scale-in',
    backdrop: 'animate-fade-in'
  },
  hideClass: {
    popup: 'animate-fade-out',
    backdrop: 'animate-fade-out'
  },
  // Mobile responsive settings
  width: 'auto',
  padding: '1rem',
  heightAuto: true,
  scrollbarPadding: false
};

// Configure SweetAlert2 default options with enhanced styling
Swal.mixin({
  ...darkThemeConfig,
  buttonsStyling: false,
  reverseButtons: true,
  focusConfirm: false,
  allowOutsideClick: true,
  allowEscapeKey: true,
  // Better mobile experience
  grow: 'row',
  backdrop: true,
});

export const showSuccessAlert = async (title: string, text?: string, options?: any) => {
  return Swal.fire({
    icon: "success",
    title,
    text,
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
    toast: false,
    position: 'center',
    ...darkThemeConfig,
    ...options,
  });
};

export const showErrorAlert = async (title: string, text?: string, options?: any) => {
  return Swal.fire({
    icon: "error",
    title,
    text,
    showConfirmButton: true,
    confirmButtonText: "Mengerti",
    ...darkThemeConfig,
    ...options,
  });
};

export const showInfoAlert = async (title: string, text?: string, options?: any) => {
  return Swal.fire({
    icon: "info",
    title,
    text,
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
    ...darkThemeConfig,
    ...options,
  });
};

export const showWarningAlert = async (title: string, text?: string, options?: any) => {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    showConfirmButton: true,
    confirmButtonText: "OK",
    ...darkThemeConfig,
    ...options,
  });
};

export const showConfirmAlert = async (title: string, text?: string, options?: any) => {
  return Swal.fire({
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "Ya, Lanjutkan",
    cancelButtonText: "Batal",
    reverseButtons: true,
    ...darkThemeConfig,
    ...options,
  });
};

export const showDeleteConfirmAlert = async (title: string = "Hapus Item?", text?: string) => {
  return Swal.fire({
    icon: "warning",
    title,
    text: text || "Tindakan ini tidak dapat dibatalkan!",
    showCancelButton: true,
    showDenyButton: false,
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Batal",
    reverseButtons: true,
    ...darkThemeConfig,
    customClass: {
      ...darkThemeConfig.customClass,
      confirmButton: 'enhanced-swal-confirm-btn enhanced-swal-danger-btn',
    }
  });
};

export const showLoadingAlert = (title: string = "Memproses...", text?: string) => {
  return Swal.fire({
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
    ...darkThemeConfig,
  });
};

export const showToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, text?: string) => {
  const isMobile = window.innerWidth < 640;
  
  return Swal.fire({
    icon: type,
    title,
    text,
    toast: !isMobile, // Use full modal on mobile for better UX
    position: isMobile ? 'center' : 'top-end',
    showConfirmButton: isMobile,
    confirmButtonText: isMobile ? 'OK' : undefined,
    timer: isMobile ? undefined : 3000,
    timerProgressBar: !isMobile,
    ...darkThemeConfig,
    width: isMobile ? 'auto' : '350px', // Override width after darkThemeConfig
    customClass: {
      ...darkThemeConfig.customClass,
      popup: isMobile ? 'enhanced-swal-popup' : 'enhanced-swal-toast',
    }
  });
};
