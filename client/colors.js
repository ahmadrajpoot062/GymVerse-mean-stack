/**
 * GymVerse Color Theme - Single Source of Truth
 * Color Scheme: White (40%), Red (40%), Black (20%)
 * 
 * This file defines all colors used across the entire application.
 * To change the theme, only modify this file and all components will update automatically.
 */

const colors = {
  // Primary Colors (40% each)
  primary: {
    white: '#FFFFFF',
    red: '#DC2626',
    redLight: '#EF4444',
    redDark: '#B91C1C',
  },
  
  // Secondary Color (20%)
  secondary: {
    black: '#000000',
    blackLight: '#1F2937',
    blackDark: '#111827',
  },
  
  // Accent Colors for UI
  accent: {
    gray: '#6B7280',
    grayLight: '#9CA3AF',
    grayDark: '#374151',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  
  // Gradient Combinations
  gradients: {
    redToBlack: 'linear-gradient(135deg, #DC2626 0%, #000000 100%)',
    whiteToRed: 'linear-gradient(135deg, #FFFFFF 0%, #DC2626 100%)',
    blackToRed: 'linear-gradient(135deg, #000000 0%, #DC2626 100%)',
  },
  
  // Background Colors
  backgrounds: {
    primary: '#FFFFFF',
    secondary: '#DC2626',
    dark: '#000000',
    darkGray: '#1F2937',
    lightGray: '#F9FAFB',
  },
  
  // Text Colors
  text: {
    primary: '#000000',
    secondary: '#DC2626',
    white: '#FFFFFF',
    gray: '#6B7280',
    light: '#9CA3AF',
  },
  
  // Border Colors
  borders: {
    primary: '#DC2626',
    secondary: '#000000',
    light: '#E5E7EB',
    dark: '#374151',
  },
  
  // Button Colors
  buttons: {
    primary: {
      bg: '#DC2626',
      text: '#FFFFFF',
      hover: '#B91C1C',
    },
    secondary: {
      bg: '#000000',
      text: '#FFFFFF',
      hover: '#1F2937',
    },
    outline: {
      bg: 'transparent',
      text: '#DC2626',
      border: '#DC2626',
      hover: '#DC2626',
      hoverText: '#FFFFFF',
    },
  },
};

// CSS Custom Properties for easy integration
const cssVariables = {
  '--color-primary-white': colors.primary.white,
  '--color-primary-red': colors.primary.red,
  '--color-primary-red-light': colors.primary.redLight,
  '--color-primary-red-dark': colors.primary.redDark,
  '--color-secondary-black': colors.secondary.black,
  '--color-secondary-black-light': colors.secondary.blackLight,
  '--color-secondary-black-dark': colors.secondary.blackDark,
  '--color-accent-gray': colors.accent.gray,
  '--color-accent-gray-light': colors.accent.grayLight,
  '--color-accent-gray-dark': colors.accent.grayDark,
  '--color-success': colors.accent.success,
  '--color-warning': colors.accent.warning,
  '--color-error': colors.accent.error,
  '--gradient-red-to-black': colors.gradients.redToBlack,
  '--gradient-white-to-red': colors.gradients.whiteToRed,
  '--gradient-black-to-red': colors.gradients.blackToRed,
};

// Tailwind CSS color configuration
const tailwindColors = {
  primary: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: colors.primary.red,
    600: colors.primary.redDark,
    700: '#991B1B',
    800: '#7F1D1D',
    900: '#450A0A',
  },
  secondary: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: colors.accent.gray,
    600: colors.accent.grayDark,
    700: '#1F2937',
    800: colors.secondary.blackLight,
    900: colors.secondary.black,
  },
  white: colors.primary.white,
  black: colors.secondary.black,
};

module.exports = {
  colors,
  cssVariables,
  tailwindColors,
};

// For ES6 modules
if (typeof module === 'undefined') {
  window.GymVerseColors = { colors, cssVariables, tailwindColors };
}
