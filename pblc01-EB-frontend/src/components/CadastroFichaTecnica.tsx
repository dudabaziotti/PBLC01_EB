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
  Checkbox,
  FormGroup,
  FormControlLabel,
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

const FORMATOS_DISPONIVEIS = ['PDF', 'EXCEL', 'CSV', 'JSON'] as const;
type Formato = typeof FORMATOS_DISPONIVEIS[number];

const schema = yup.object({
  idFicha: yup
    .string()
    .required('O ID da ficha é obrigatório')
    .min(3, 'Mínimo 3 caracteres')
    .matches(/^[A-Za-z0-9_-]+$/, 'Use apenas letras, números, _ ou -'),
  nomeReceita: yup
    .string()
    .required('O nome da receita é obrigatório')
    .min(3, 'Mínimo 3 caracteres'),
  autor: yup
    .string()
    .required('O autor é obrigatório')
    .min(3, 'Mínimo 3 caracteres'),
  pesoTotal: yup
    .number()
    .typeError('Informe um valor numérico')
    .positive('O peso deve ser maior que zero')
    .required('O peso total é obrigatório'),
  tamanhoPorcao: yup
    .number()
    .typeError('Informe um valor numérico')
    .positive('O tamanho da porção deve ser maior que zero')
    .required('O tamanho da porção é obrigatório'),
  formatos: yup
    .array()
    .of(yup.string().oneOf(FORMATOS_DISPONIVEIS))
    .min(1, 'Selecione ao menos um formato de saída')
    .required(),
  usuarioId: yup
    .number()
    .typeError('Informe um ID numérico válido')
    .positive('O ID deve ser maior que zero')
    .integer('O ID deve ser inteiro')
    .nullable()
    .optional(),
}).required();

interface ICadastroFichaTecnica {
  idFicha: string;
  nomeReceita: string;
  autor: string;
  pesoTotal: number;
  tamanhoPorcao: number;
  formatos: (Formato | undefined)[];
  usuarioId?: number | null;
}

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

export default function CadastroFichaTecnica() {
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
  } = useForm<ICadastroFichaTecnica>({
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
    defaultValues: {
      idFicha: '',
      nomeReceita: '',
      autor: '',
      pesoTotal: undefined,
      tamanhoPorcao: undefined,
      formatos: [],
      usuarioId: undefined,
    },
  });

  const formatosSelecionados = (watch('formatos') ?? []) as Formato[];

  const onSubmit = (data: ICadastroFichaTecnica) => {
    console.log('Payload:', data);
    setMensagemSucesso(`Ficha Técnica "${data.nomeReceita}" cadastrada com sucesso!`);
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
            <Typography variant="h5" sx={{ mb: 1 }}>Cadastrar Ficha Técnica</Typography>
            <Typography variant="subtitle1" sx={{ fontSize: '0.95rem' }}>
              Preencha as informações da ficha técnica
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
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="idFicha"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<>ID da Ficha <Box component="span" sx={{ color: '#ef4444' }}>*</Box></>}
                      placeholder="Ex: FICHA-001"
                      error={!!errors.idFicha}
                      helperText={errors.idFicha?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
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

              {/* Autor */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="autor"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<>Autor <Box component="span" sx={{ color: '#ef4444' }}>*</Box></>}
                      placeholder="Nome do nutricionista ou chef"
                      error={!!errors.autor}
                      helperText={errors.autor?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="usuarioId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      label={<>ID Usuário <Box component="span" sx={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.85rem' }}>(Opcional)</Box></>}
                      placeholder="Ex: 1"
                      type="number"
                      slotProps={{ htmlInput: { min: 1 } }}
                      error={!!errors.usuarioId}
                      helperText={errors.usuarioId?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="pesoTotal"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      label={<>Peso Total (g) <Box component="span" sx={{ color: '#ef4444' }}>*</Box></>}
                      placeholder="Ex: 800"
                      type="number"
                      slotProps={{ htmlInput: { min: 0.1, step: 0.1 } }}
                      error={!!errors.pesoTotal}
                      helperText={errors.pesoTotal?.message ?? 'Peso total da receita em gramas'}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="tamanhoPorcao"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      label={<>Tamanho da Porção (g) <Box component="span" sx={{ color: '#ef4444' }}>*</Box></>}
                      placeholder="Ex: 200"
                      type="number"
                      slotProps={{ htmlInput: { min: 0.1, step: 0.1 } }}
                      error={!!errors.tamanhoPorcao}
                      helperText={errors.tamanhoPorcao?.message ?? 'Peso de cada porção em gramas'}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box sx={{
                  bgcolor: '#fff7ed',
                  border: `1px dashed ${errors.formatos ? '#f87171' : '#ff8832'}`,
                  borderRadius: '12px',
                  p: 3,
                }}>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: '#fc813f', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5 }}>
                    Formatos de Exportação <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                  </Typography>
                  <Controller
                    name="formatos"
                    control={control}
                    render={({ field }) => (
                      <FormGroup row>
                        {FORMATOS_DISPONIVEIS.map((fmt) => {
                          const checked = (field.value as Formato[]).includes(fmt);
                          return (
                            <FormControlLabel
                              key={fmt}
                              label={fmt}
                              control={
                                <Checkbox
                                  checked={checked}
                                  onChange={() => {
                                    const atual = field.value as Formato[];
                                    field.onChange(checked ? atual.filter((f) => f !== fmt) : [...atual, fmt]);
                                  }}
                                  sx={{ color: '#ff8832', '&.Mui-checked': { color: '#ff8832' } }}
                                />
                              }
                            />
                          );
                        })}
                      </FormGroup>
                    )}
                  />
                  {errors.formatos && (
                    <Typography sx={{ fontSize: '0.75rem', color: '#ef4444', mt: 0.5 }}>
                      {errors.formatos.message}
                    </Typography>
                  )}
                  {formatosSelecionados.length > 0 && (
                    <Typography sx={{ fontSize: '0.8rem', color: '#475569', mt: 1 }}>
                      Selecionados: {formatosSelecionados.join(', ')}
                    </Typography>
                  )}
                </Box>
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
                  {isSubmitting ? 'Salvando...' : 'Cadastrar Ficha Técnica'}
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