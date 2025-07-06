/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#2563eb', // blue-600
        'primary-foreground': '#ffffff', // white
        
        // Secondary Colors
        'secondary': '#64748b', // slate-500
        'secondary-foreground': '#ffffff', // white
        
        // Accent Colors
        'accent': '#0ea5e9', // sky-500
        'accent-foreground': '#ffffff', // white
        
        // Background Colors
        'background': '#ffffff', // white
        'surface': '#f8fafc', // slate-50
        
        // Text Colors
        'text-primary': '#0f172a', // slate-900
        'text-secondary': '#475569', // slate-600
        
        // Status Colors
        'success': '#059669', // emerald-600
        'success-foreground': '#ffffff', // white
        'warning': '#d97706', // amber-600
        'warning-foreground': '#ffffff', // white
        'error': '#dc2626', // red-600
        'error-foreground': '#ffffff', // white
        
        // Border Colors
        'border': '#e2e8f0', // slate-200
        'border-light': '#f1f5f9', // slate-100
      },
      fontFamily: {
        'heading': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'caption': ['Inter', 'sans-serif'],
        'data': ['JetBrains Mono', 'monospace'],
      },
      fontWeight: {
        'heading-normal': '400',
        'heading-medium': '500',
        'heading-semibold': '600',
        'body-normal': '400',
        'body-medium': '500',
        'caption-normal': '400',
        'data-normal': '400',
      },
      boxShadow: {
        'elevation-1': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'elevation-2': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'elevation-3': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'elevation-4': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'interactive': '6px',
        'container': '4px',
      },
      spacing: {
        'sidebar-width': '240px',
        'sidebar-padding': '16px',
        'content-margin': '24px',
      },
      zIndex: {
        'sidebar': '100',
        'dropdown': '200',
        'tooltip': '300',
        'upload-progress': '500',
        'modal': '1000',
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'fade-in': 'fadeIn 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in': 'slideIn 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}