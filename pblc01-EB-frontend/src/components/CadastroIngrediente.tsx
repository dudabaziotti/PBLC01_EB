import { useState, useEffect } from 'react';
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
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

const UNIDADES = ['g', 'kg', 'ml', 'l', 'unidade', 'porção'] as const;

const FONTES_MOCK = [
  { id: 1, nome: 'TACO – Tabela Brasileira de Composição de Alimentos' },
  { id: 2, nome: 'IBGE – Pesquisa de Orçamentos Familiares' },
  { id: 3, nome: 'USDA – FoodData Central' },
  { id: 4, nome: 'Philippi ST – Tabela de Composição de Alimentos' },
];

const schema = yup.object({
  nome: yup
    .string()
    .required('O nome do ingrediente é obrigatório')
    .min(2, 'Mínimo 2 caracteres'),
  quantidade: yup
    .number()
    .typeError('A quantidade deve ser um número')
    .positive('A quantidade deve ser maior que zero')
    .required('A quantidade é obrigatória'),
  unidade: yup
    .string()
    .oneOf(UNIDADES, 'Selecione uma unidade válida')
    .required('A unidade é obrigatória'),
  kcal: yup
    .number()
    .typeError('Deve ser um número')
    .min(0, 'Valor inválido')
    .required('Obrigatório'),
  carboidratos: yup
    .number()
    .typeError('Deve ser um número')
    .min(0, 'Valor inválido')
    .required('Obrigatório'),
  proteinas: yup
    .number()
    .typeError('Deve ser um número')
    .min(0, 'Valor inválido')
    .required('Obrigatório'),
  gorduras: yup
    .number()
    .typeError('Deve ser um número')
    .min(0, 'Valor inválido')
    .required('Obrigatório'),
  fonteReferenciaId: yup
    .number()
    .typeError('Selecione uma fonte de referência')
    .positive('Selecione uma fonte de referência')
    .integer()
    .required('A fonte de referência é obrigatória'),
}).required();

type ICadastroIngrediente = yup.InferType<typeof schema>;

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
          '&.Mui-disabled': { backgroundColor: '#e2e8f0' },
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

export default function CadastroIngrediente() {
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<ICadastroIngrediente>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      nome: '',
      quantidade: 100,
      unidade: '' as typeof UNIDADES[number],
      kcal: 0,
      carboidratos: 0,
      proteinas: 0,
      gorduras: 0,
      fonteReferenciaId: 0,
    },
  });

  const unidadeSelecionada = watch('unidade');
  const quantidadeAtual = watch('quantidade');

  useEffect(() => {
    if (unidadeSelecionada === 'g' || unidadeSelecionada === 'ml') {
      setValue('quantidade', 100, { shouldValidate: true });
    } else if (unidadeSelecionada) {
      setValue('quantidade', 1, { shouldValidate: true });
    }
  }, [unidadeSelecionada, setValue]);

  const onSubmit = (data: ICadastroIngrediente) => {
    console.log('Payload:', data);
    setMensagemSucesso(`Ingrediente "${data.nome}" cadastrado com sucesso!`);
    reset({
      nome: '',
      quantidade: 100,
      unidade: '' as typeof UNIDADES[number],
      kcal: 0,
      carboidratos: 0,
      proteinas: 0,
      gorduras: 0,
      fonteReferenciaId: 0,
    });
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
            <Typography variant="h5" sx={{ mb: 1 }}>Cadastrar Ingrediente</Typography>
            <Typography variant="subtitle1" sx={{ fontSize: '0.95rem' }}>
              Preencha as informações do ingrediente
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
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="nome"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<>Nome do Ingrediente <Box component="span" sx={{ color: '#ef4444' }}>*</Box></>}
                      placeholder="Ex: Frango grelhado sem pele"
                      error={!!errors.nome}
                      helperText={errors.nome?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Controller
                  name="quantidade"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label={<>Qtd. Base <Box component="span" sx={{ color: '#ef4444' }}>*</Box></>}
                      error={!!errors.quantidade}
                      helperText={errors.quantidade?.message}
                      fullWidth
                      disabled
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Controller
                  name="unidade"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.unidade}>
                      <InputLabel>Unidade <Box component="span" sx={{ color: '#ef4444' }}>*</Box></InputLabel>
                      <Select {...field} label="Unidade *">
                        <MenuItem value=""><em>Selecione...</em></MenuItem>
                        {UNIDADES.map((u) => (
                          <MenuItem key={u} value={u}>{u}</MenuItem>
                        ))}
                      </Select>
                      {errors.unidade && <FormHelperText>{errors.unidade.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 1, mb: -1, color: '#0f172a' }}>
                  Informação Nutricional {unidadeSelecionada ? `(por ${quantidadeAtual} ${unidadeSelecionada})` : ''}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#0f172a' }}>
                  Calorias (kcal) <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                </Typography>
                <Controller
                  name="kcal"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      error={!!errors.kcal}
                      helperText={errors.kcal?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#0f172a' }}>
                  Carboidratos (g) <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                </Typography>
                <Controller
                  name="carboidratos"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      error={!!errors.carboidratos}
                      helperText={errors.carboidratos?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#0f172a' }}>
                  Proteínas (g) <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                </Typography>
                <Controller
                  name="proteinas"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      error={!!errors.proteinas}
                      helperText={errors.proteinas?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#0f172a' }}>
                  Gorduras (g) <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                </Typography>
                <Controller
                  name="gorduras"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      error={!!errors.gorduras}
                      helperText={errors.gorduras?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="fonteReferenciaId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.fonteReferenciaId}>
                      <InputLabel>
                        Fonte de Referência <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                      </InputLabel>
                      <Select
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        label="Fonte de Referência *"
                      >
                        <MenuItem value=""><em>Selecione uma fonte...</em></MenuItem>
                        {FONTES_MOCK.map((fonte) => (
                          <MenuItem key={fonte.id} value={fonte.id}>
                            {fonte.nome}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {errors.fonteReferenciaId?.message ?? 'Fontes cadastradas no sistema'}
                      </FormHelperText>
                    </FormControl>
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
                  {isSubmitting ? 'Salvando...' : 'Cadastrar Ingrediente'}
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