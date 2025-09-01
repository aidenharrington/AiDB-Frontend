import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from './theme';
import { designSystem } from './designSystem';

// Create a context for the design system
export const DesignSystemContext = React.createContext(designSystem);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <DesignSystemContext.Provider value={designSystem}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </DesignSystemContext.Provider>
  );
};

// Hook to access the design system
export const useDesignSystem = () => {
  const context = React.useContext(DesignSystemContext);
  if (!context) {
    throw new Error('useDesignSystem must be used within a ThemeProvider');
  }
  return context;
};

// Export the theme and design system for direct access
export { theme, designSystem };
