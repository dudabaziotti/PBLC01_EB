import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';

interface ThemeModeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('themeMode') === 'dark';
  });

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('themeMode', next ? 'dark' : 'light');
      return next;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? 'dark' : 'light',
          primary: { main: '#ff8832' },
          secondary: { main: '#ea580c' },
          error: { main: '#ef4444' },
          success: { main: '#15803d' },
          background: {
            default: isDark ? '#121212' : '#f8fafc',
            paper: isDark ? '#1e1e1e' : '#ffffff',
          },
        },
        typography: {
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          h4: { fontWeight: 800, letterSpacing: '-0.03em' },
          h5: { fontWeight: 800, letterSpacing: '-0.03em' },
        },
        shape: { borderRadius: 12 },
        components: {
          MuiButton: {
            styleOverrides: {
              root: { textTransform: 'none', fontWeight: 700, letterSpacing: '0.04em', borderRadius: 100 },
            },
          },
        },
      }),
    [isDark]
  );

  return (
    <ThemeModeContext.Provider value={{ isDark, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode deve ser usado dentro de ThemeProvider');
  }
  return context;
}