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
  { label: 'Cadastro de Receita',           path: '/receita' },
  { label: 'Cadastro de Ingrediente',        path: '/ingrediente' },
  { label: 'Cadastro de Fonte de Referência', path: '/fonte' },
  { label: 'Cadastro de Ficha Técnica',      path: '/ficha' },
];

const schema = yup.object({
  nomeReceita: yup
    .string()
    .required('O nome da receita é obrigatório')
    .min(3, 'Mínimo 3 caracteres'),
  modoPreparo: yup
    .string()
    .required('O modo de preparo é obrigatório')
    .min(20, 'Descreva o preparo com ao menos 20 caracteres'),
  tempoPreparo: yup
    .number()
    .typeError('Informe um número de minutos válido')
    .positive('O tempo deve ser maior que zero')
    .integer('Informe um número inteiro de minutos')
    .max(1440, 'O tempo não pode ultrapassar 1440 minutos (24 h)')
    .required('O tempo de preparo é obrigatório'),
  rendimentoPorcoes: yup
    .number()
    .typeError('Informe um número válido de porções')
    .positive('O rendimento deve ser maior que zero')
    .integer('Informe um número inteiro')
    .max(999, 'Valor máximo: 999 porções')
    .required('O rendimento em porções é obrigatório'),
}).required();

type ICadastroReceita = yup.InferType<typeof schema>;

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

export default function CadastroReceita() {
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<ICadastroReceita>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      nomeReceita: '',
      modoPreparo: '',
      tempoPreparo: undefined,
      rendimentoPorcoes: undefined,
    },
  });

  const onSubmit = (data: ICadastroReceita) => {
    console.log('Payload:', data);
    setMensagemSucesso(`Receita "${data.nomeReceita}" cadastrada com sucesso!`);
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
            <Typography variant="h5" sx={{ mb: 1 }}>Cadastrar Receita</Typography>
            <Typography variant="subtitle1" sx={{ fontSize: '0.95rem' }}>
              Preencha as informações de preparo da receita
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
                  name="nomeReceita"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<>Nome da Receita <Box component="span" sx={{ color: '#ef4444' }}>*</Box></>}
                      placeholder="Ex: Frango Grelhado com Legumes"
                      error={!!errors.nomeReceita}
                      helperText={errors.nomeReceita?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="tempoPreparo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      label={<>Tempo de Preparo (min) <Box component="span" sx={{ color: '#ef4444' }}>*</Box></>}
                      placeholder="Ex: 45"
                      type="number"
                      slotProps={{ htmlInput: { min: 1, max: 1440 } }}
                      error={!!errors.tempoPreparo}
                      helperText={errors.tempoPreparo?.message ?? 'Em minutos (máx. 1440)'}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="rendimentoPorcoes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      label={<>Rendimento (porções) <Box component="span" sx={{ color: '#ef4444' }}>*</Box></>}
                      placeholder="Ex: 4"
                      type="number"
                      slotProps={{ htmlInput: { min: 1, max: 999 } }}
                      error={!!errors.rendimentoPorcoes}
                      helperText={errors.rendimentoPorcoes?.message ?? 'Número de porções da receita'}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="modoPreparo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<>Modo de Preparo <Box component="span" sx={{ color: '#ef4444' }}>*</Box></>}
                      placeholder="Descreva passo a passo o preparo da receita..."
                      multiline
                      rows={6}
                      error={!!errors.modoPreparo}
                      helperText={errors.modoPreparo?.message ?? `${field.value?.length ?? 0} caracteres (mín. 20)`}
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
                  {isSubmitting ? 'Salvando...' : 'Cadastrar Receita'}
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