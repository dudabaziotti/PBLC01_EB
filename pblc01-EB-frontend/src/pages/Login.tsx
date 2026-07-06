import { useState } from 'react';
import { Box, Button, TextField, Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import api from '../api/axios';

import logoNutriStack from '../assets/painel-logo-img.jpeg';

export default function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }
    setCarregando(true);
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token } = response.data;
      setToken(token);
      navigate('/');
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setCarregando(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      {/* Painel esquerdo com gradiente, igual ao CadastroUsuario.tsx */}
      <Box
        sx={{
          flex: { xs: 'none', md: '0 0 38%' },
          background: 'linear-gradient(135deg, #ff8832 0%, #ea580c 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 4, md: 5 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: { xs: '0 0 32px 32px', md: '0' },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 280,
            height: 280,
            top: -80,
            left: -80,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 220,
            height: 220,
            bottom: -60,
            right: -60,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            pointerEvents: 'none',
          }}
        />

        <Box
          sx={{
            width: 90,
            height: 90,
            borderRadius: '50%',
            bgcolor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            position: 'relative',
            zIndex: 1,
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={logoNutriStack}
            alt="NutriStack"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scale(1.5) translateX(1.5px)',
            }}
          />
        </Box>

        <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px', mb: 3, position: 'relative', zIndex: 1 }}>
          NutriStack
        </Typography>

        <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.25, mb: 1.5, position: 'relative', zIndex: 1 }}>
          Bem-vindo <br /> de volta!
        </Typography>

        <Typography sx={{ fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.65, position: 'relative', zIndex: 1, maxWidth: '280px' }}>
          Entre com suas informações para acessar o sistema de fichas técnicas nutricionais.
        </Typography>
      </Box>

      {/* Painel direito com o formulário */}
      <Box
        sx={{
          flex: 1,
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: { xs: 3, md: 6, lg: 8 },
        }}
      >
        <Box sx={{ maxWidth: '420px', width: '100%', mx: 'auto' }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
              Entrar
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Acesse sua conta para continuar
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              fullWidth
            />
            <TextField
              label="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={handleKeyDown}
              fullWidth
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              disabled={carregando}
              sx={{
                py: 1.5,
                mt: 1,
                background: 'linear-gradient(135deg, #ff8832 0%, #ea580c 100%)',
                boxShadow: '0 8px 16px -4px rgba(249, 115, 22, 0.25)',
                '&:hover:not(:disabled)': { transform: 'translateY(-2px)' },
              }}
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
            Ainda não tem conta?{' '}
            <Box
              component="span"
              onClick={() => navigate('/cadastro')}
              sx={{ color: 'primary.main', fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Criar conta
            </Box>
          </Typography>

          <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center', mt: 3 }}>
            NutriStack - EB © 2026
          </Typography>
        </Box>
      </Box>

      <Snackbar open={!!erro} autoHideDuration={4000} onClose={() => setErro('')}>
        <Alert severity="error" onClose={() => setErro('')}>
          {erro}
        </Alert>
      </Snackbar>
    </Box>
  );
}