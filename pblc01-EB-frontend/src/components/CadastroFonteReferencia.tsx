import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Collapse,
  Grid as Grid,
  AppBar,
  Toolbar,
} from '@mui/material';

const ROTAS = [
  { label: 'Cadastro de Receita',            path: '/receita' },
  { label: 'Cadastro de Ingrediente',         path: '/ingrediente' },
  { label: 'Cadastro de Fonte de Referência', path: '/fonte' },
  { label: 'Cadastro de Ficha Técnica',       path: '/ficha' },
];

const anoAtual = new Date().getFullYear();

const schema = yup.object({
  nomeFonte: yup
    .string()
    .required('O nome da fonte é obrigatório')
    .min(3, 'Mínimo 3 caracteres'),
  linkFonte: yup
    .string()
    .required('O link é obrigatório')
    .url('Informe uma URL válida (ex: https://exemplo.com)'),
  anoPublicacao: yup
    .string()
    .required('O ano de publicação é obrigatório')
    .matches(/^\d{4}$/, 'Informe um ano com 4 dígitos')
    .test('ano-valido', `O ano deve estar entre 1900 e ${anoAtual}`, (v) => {
      const n = Number(v);
      return n >= 1900 && n <= anoAtual;
    }),
}).required();

type ICadastroFonteReferencia = yup.InferType<typeof schema>;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary:    { main: '#ff8832' },
    secondary:  { main: '#ea580c' },
    error:      { main: '#ef4444' },
    success:    { main: '#15803d' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text:       { primary: '#0f172a', secondary: '#475569' },
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    h5: { fontWeight: 800, letterSpacing: '-0.03em', color: '#ff8832' },
    subtitle1: { color: '#475569' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#f1f5f9',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '& fieldset': { border: '2px solid transparent' },
          '&:hover fieldset': { borderColor: '#e2e8f0' },
          '&.Mui-focused fieldset': { borderColor: '#ff8832', borderWidth: '2px' },
          '&.Mui-focused': {
            backgroundColor: '#ffffff',
            boxShadow: '0 0 0 4px rgba(249, 115, 22, 0.25)',
          },
          '&.Mui-error': { backgroundColor: '#fef2f2' },
          '&.Mui-error fieldset': { borderColor: '#f87171' },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { fontWeight: 600, color: '#0f172a' } },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          letterSpacing: '0.04em',
          borderRadius: 100,
        },
      },
    },
  },
});

export default function CadastroFonteReferencia() {
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<ICadastroFonteReferencia>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: { nomeFonte: '', linkFonte: '', anoPublicacao: '' },
  });

  const onSubmit = (data: ICadastroFonteReferencia) => {
    console.log('Payload:', data);
    setMensagemSucesso(`Fonte "${data.nomeFonte}" cadastrada com sucesso!`);
    reset();
    setTimeout(() => setMensagemSucesso(''), 5000);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Box sx={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              <Box component="img" src="src/assets/painel-logo-img.jpeg" alt="NutriStack" sx={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.5) translateX(1.5px)' }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#ff8832', letterSpacing: '-0.3px' }}>
              NutriStack
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
            {ROTAS.map((rota) => (
              <Button
                key={rota.path}
                onClick={() => navigate(rota.path)}
                sx={{
                  color: location.pathname === rota.path ? '#ff8832' : '#475569',
                  fontWeight: location.pathname === rota.path ? 700 : 500,
                  fontSize: '0.85rem',
                  borderBottom: location.pathname === rota.path ? '2px solid #ff8832' : '2px solid transparent',
                  borderRadius: 0,
                  px: 1.5,
                  '&:hover': { color: '#ff8832', bgcolor: 'transparent' },
                }}
              >
                {rota.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 3, md: 6 } }}>
        <Box sx={{ maxWidth: '700px', width: '100%', bgcolor: '#ffffff', borderRadius: 3, p: { xs: 3, md: 5 }, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>Cadastrar Fonte de Referência</Typography>
            <Typography variant="subtitle1" sx={{ fontSize: '0.95rem' }}>
              Preencha os dados da publicação de referência
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
              <Box component="span" sx={{ color: '#ef4444', fontWeight: 700 }}>*</Box> Campos obrigatórios
            </Typography>
          </Box>

          <Collapse in={!!mensagemSucesso}>
            <Alert
              severity="success"
              sx={{ mb: 4, bgcolor: '#dcfce7', color: '#15803d', border: '1px solid #86efac', borderRadius: 2 }}
              onClose={() => setMensagemSucesso('')}
            >
              {mensagemSucesso}
            </Alert>
          </Collapse>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="nomeFonte"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<>Nome da Fonte <Box component="span" sx={{ color: '#ef4444' }}>*</Box></>}
                      placeholder="Ex: TACO – Tabela Brasileira de Composição de Alimentos"
                      error={!!errors.nomeFonte}
                      helperText={errors.nomeFonte?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <Controller
                  name="linkFonte"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<>Link / URL <Box component="span" sx={{ color: '#ef4444' }}>*</Box></>}
                      placeholder="https://www.exemplo.com/publicacao"
                      error={!!errors.linkFonte}
                      helperText={errors.linkFonte?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="anoPublicacao"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<>Ano de Publicação <Box component="span" sx={{ color: '#ef4444' }}>*</Box></>}
                      placeholder={`Ex: ${anoAtual}`}
                      slotProps={{ htmlInput: { maxLength: 4 } }}
                      error={!!errors.anoPublicacao}
                      helperText={errors.anoPublicacao?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || !isValid}
                  sx={{
                    width: '100%',
                    maxWidth: '320px',
                    py: 1.5,
                    fontSize: '1rem',
                    background: isValid ? 'linear-gradient(135deg, #ff8832 0%, #ea580c 100%)' : undefined,
                    boxShadow: isValid ? '0 8px 16px -4px rgba(249,115,22,0.25)' : 'none',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover:not(:disabled)': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 20px -4px rgba(249,115,22,0.25)',
                    },
                  }}
                >
                  {isSubmitting ? 'Salvando...' : 'Cadastrar Fonte'}
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.82rem' }}>
              NutriStack - EB © 2026
            </Typography>
          </Box>

        </Box>
      </Box>
    </ThemeProvider>
  );
}