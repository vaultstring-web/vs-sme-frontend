export const colors = {
  // Primary Brand Colors
  primary: {
    green: {
      50: '#f0f9eb',
      100: '#d9f0d0',
      200: '#b8e2a8',
      300: '#8bcf75',
      400: '#5fba4c',
      500: '#448a33', // Primary Green
      600: '#367028',
      700: '#2c5720',
      800: '#234419',
      900: '#1b3614',
    },
    blue: {
      50: '#f0f5f6',
      100: '#d5e4e7',
      200: '#b3cdd4',
      300: '#8ab1bc',
      400: '#6395a3',
      500: '#3b5a65', // Primary Blue
      600: '#314c55',
      700: '#273e45',
      800: '#1e3137',
      900: '#16252a',
    }
  },
  
  // Semantic Colors (WCAG 2.1 AA Compliant)
  semantic: {
    success: {
      light: '#d4edda',
      main: '#28a745',
      dark: '#1e7e34',
      text: '#155724'
    },
    error: {
      light: '#f8d7da',
      main: '#dc3545',
      dark: '#c82333',
      text: '#721c24'
    },
    warning: {
      light: '#fff3cd',
      main: '#ffc107',
      dark: '#e0a800',
      text: '#856404'
    },
    info: {
      light: '#d1ecf1',
      main: '#17a2b8',
      dark: '#138496',
      text: '#0c5460'
    }
  },
  
  // Neutral Grayscale
  neutral: {
    0: '#ffffff',
    50: '#f8f9fa',
    100: '#f1f3f5',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#6c757d',
    700: '#495057',
    800: '#343a40',
    900: '#212529',
    1000: '#000000'
  },
  
  // Dark Mode Variants
  dark: {
    background: '#121212',
    surface: '#1e1e1e',
    primary: '#5baa46', // Adjusted for dark mode
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
      disabled: '#666666'
    }
  }
};

export const typography = {
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'Roboto Mono', 'Courier New', monospace"
  },
  
  // Scale based on 1rem = 16px
  scale: {
    h1: {
      fontSize: '3rem',      // 48px
      lineHeight: 1.2,
      fontWeight: 700,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontSize: '2.25rem',   // 36px
      lineHeight: 1.25,
      fontWeight: 700,
      letterSpacing: '-0.01em'
    },
    h3: {
      fontSize: '1.75rem',   // 28px
      lineHeight: 1.3,
      fontWeight: 600
    },
    h4: {
      fontSize: '1.5rem',    // 24px
      lineHeight: 1.35,
      fontWeight: 600
    },
    h5: {
      fontSize: '1.25rem',   // 20px
      lineHeight: 1.4,
      fontWeight: 600
    },
    h6: {
      fontSize: '1rem',      // 16px
      lineHeight: 1.5,
      fontWeight: 600
    },
    body: {
      large: {
        fontSize: '1.125rem', // 18px
        lineHeight: 1.6,
        fontWeight: 400
      },
      regular: {
        fontSize: '1rem',     // 16px
        lineHeight: 1.6,
        fontWeight: 400
      },
      small: {
        fontSize: '0.875rem', // 14px
        lineHeight: 1.57,
        fontWeight: 400
      }
    },
    caption: {
      fontSize: '0.75rem',   // 12px
      lineHeight: 1.5,
      fontWeight: 400,
      letterSpacing: '0.02em'
    },
    button: {
      large: {
        fontSize: '1rem',
        lineHeight: 1.5,
        fontWeight: 600,
        letterSpacing: '0.02em'
      },
      medium: {
        fontSize: '0.875rem',
        lineHeight: 1.43,
        fontWeight: 600,
        letterSpacing: '0.02em'
      },
      small: {
        fontSize: '0.75rem',
        lineHeight: 1.33,
        fontWeight: 600,
        letterSpacing: '0.02em'
      }
    },
    label: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
      fontWeight: 500,
      letterSpacing: '0.02em'
    }
  }
};

export const spacing = {
  // Base unit: 4px
  unit: 4,
  
  // Scale (in pixels, convert to rem/em as needed)
  scale: {
    xs: 4,    // 0.25rem
    sm: 8,    // 0.5rem
    md: 16,   // 1rem
    lg: 24,   // 1.5rem
    xl: 32,   // 2rem
    '2xl': 48, // 3rem
    '3xl': 64, // 4rem
    '4xl': 80  // 5rem
  },
  
  // Layout tokens
  layout: {
    container: {
      maxWidth: '1200px',
      padding: {
        mobile: '1rem',
        desktop: '2rem'
      }
    },
    section: {
      vertical: {
        xs: '2rem',
        sm: '3rem',
        md: '4rem',
        lg: '6rem'
      }
    },
    grid: {
      gap: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem'
      }
    }
  }
};
