import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import Header from './components/layout/Header';
import AppRouter from './components/layout/AppRouter';

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

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <AppContainer>
          <Header />
          <MainContent>
            <AppRouter />
          </MainContent>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
};

export default App;
