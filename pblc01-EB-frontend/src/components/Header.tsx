import { AppBar, Toolbar, Box, Typography, Button, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeMode } from '../theme/ThemeContext';
import { useAuth } from '../auth/AuthContext';

const ROTAS = [
  { label: 'Usuários', path: '/usuarios' },
  { label: 'Ingredientes', path: '/ingredientes' },
  { label: 'Receitas', path: '/receitas' },
  { label: 'Fichas Técnicas', path: '/fichas' },
];

import logoNutriStack from '../assets/orange-svgrepo-com.svg';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useThemeMode();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 }, flexWrap: 'wrap', gap: 1 }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
          onClick={() => navigate('/usuarios')}
        >
          <Box
            component="img"
            src={logoNutriStack}
            alt="Logo NutriStack"
            sx={{
              width: 40,
              height: 40,
              objectFit: 'cover', 
              flexShrink: 0,
              borderRadius: '50%', 
            }}
          />
          <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'primary.main', letterSpacing: '-0.3px' }}>
            NutriStack
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
          {ROTAS.map((rota) => (
            <Button
              key={rota.path}
              onClick={() => navigate(rota.path)}
              sx={{
                color: location.pathname === rota.path ? 'primary.main' : 'text.secondary',
                fontWeight: location.pathname === rota.path ? 700 : 500,
                fontSize: '0.85rem',
                borderBottom: location.pathname === rota.path ? '2px solid' : '2px solid transparent',
                borderColor: 'primary.main',
                borderRadius: 0,
                px: 1.5,
                '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
              }}
            >
              {rota.label}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={toggleTheme}>
            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Button
            onClick={handleLogout}
            sx={{ color: 'text.secondary', fontWeight: 600, '&:hover': { color: 'primary.main' } }}
          >
            Sair
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}