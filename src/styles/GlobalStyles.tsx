import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  /* Box sizing rules */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* Remove default margin and padding */
  body,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  figure,
  blockquote,
  dl,
  dd {
    margin: 0;
    padding: 0;
  }

  /* Set core body defaults */
  body {
    min-height: 100vh;
    text-rendering: optimizeSpeed;
    line-height: 1.5;
    font-family: ${theme.fonts.body};
    background-color: ${theme.colors.background};
    color: ${theme.colors.textPrimary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  /* Make images easier to work with */
  img,
  picture {
    max-width: 100%;
    display: block;
  }

  /* Inherit fonts for inputs and buttons */
  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  /* Remove all animations and transitions for people that prefer not to see them */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* Scrollbar styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.gray800};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.gray600};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.gray500};
  }

  /* Selection styles */
  ::selection {
    background: ${theme.colors.primary};
    color: ${theme.colors.white};
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    font-weight: 700;
    line-height: 1.2;
    color: ${theme.colors.textPrimary};
    margin-bottom: ${theme.space[4]};
  }

  h1 {
    font-size: ${theme.fontSizes['4xl']};
  }

  h2 {
    font-size: ${theme.fontSizes['3xl']};
  }

  h3 {
    font-size: ${theme.fontSizes['2xl']};
  }

  h4 {
    font-size: ${theme.fontSizes.xl};
  }

  p {
    margin-bottom: ${theme.space[4]};
    color: ${theme.colors.textSecondary};
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: ${theme.colors.primaryLight};
      text-decoration: underline;
    }
  }

  /* Form elements */
  input,
  textarea,
  select {
    width: 100%;
    padding: ${theme.space[3]} ${theme.space[4]};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.md};
    background-color: ${theme.colors.surface};
    color: ${theme.colors.textPrimary};
    font-size: ${theme.fontSizes.base};
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 3px ${theme.colors.primary}33;
    }

    &::placeholder {
      color: ${theme.colors.gray500};
    }

    &:disabled {
      background-color: ${theme.colors.gray800};
      cursor: not-allowed;
      opacity: 0.7;
    }
  }

  button {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    user-select: none;
    padding: ${theme.space[2]} ${theme.space[4]};
    border-radius: ${theme.radii.md};
    transition: all 0.2s ease-in-out;
    border: 1px solid transparent;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px ${theme.colors.primary}33;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
`;
