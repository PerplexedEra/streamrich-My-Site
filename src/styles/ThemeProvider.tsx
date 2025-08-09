import React, { ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme, Theme } from './theme';
import { GlobalStyles } from './GlobalStyles';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <StyledThemeProvider theme={theme as Theme}>
      <GlobalStyles />
      {children}
    </StyledThemeProvider>
  );
};

export default ThemeProvider;
