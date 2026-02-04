import { colors, typography, spacing } from './designTokens';

export const theme = {
    colors,
    typography,
    spacing,

    // Helper to get CSS value for spacing
    spacingPx: (val: number) => `${val * spacing.unit}px`,

    // Breakpoints
    breakpoints: {
        mobile: '768px',
        tablet: '1024px',
        desktop: '1280px',
    },

    // Shadows
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },

    // Border Radius
    borderRadius: {
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
    }
};

export type Theme = typeof theme;
