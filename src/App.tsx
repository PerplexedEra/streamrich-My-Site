// This file is no longer needed with Next.js App Router
// All routing is now handled by the file-system based router in the /app directory
// This file can be safely deleted or kept as a legacy component if needed

import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import Header from './components/layout/Header';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 16px;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppContainer>
        <Header />
        <MainContent>
          {/* This component is a fallback and should not be used in the new routing system */}
          <p>This component is part of the legacy routing system and should not be rendered directly.</p>
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;
