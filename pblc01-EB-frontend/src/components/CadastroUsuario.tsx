import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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
  Grid as Grid
} from '@mui/material';

const schema = yup.object({
  nome: yup.string().required('O nome é obrigatório').min(3, 'Mínimo 3 caracteres'),
  email: yup.string().email('E-mail inválido').required('O e-mail é obrigatório'),
  senha: yup.string().min(6, 'Mínimo 6 caracteres').required('A senha é obrigatória'),
  tipo: yup
    .string()
    .oneOf(['USUARIO', 'PRODUTOR'] as const, 'Selecione um perfil')
    .required('O tipo é obrigatório'),
  telefoneContato: yup.string().default(''),
  cnpj: yup.string().default(''),
  nomeEmpresa: yup.string().default(''),
}).required();

type ICadastroUsuario = yup.InferType<typeof schema>;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary:    { main: '#ff8832' },
    secondary:  { main: '#ea580c' },
    error:      { main: '#ef4444' },
    success:    { main: '#15803d' },
    background: { default: '#ffffff', paper: '#ffffff' },
    text:       { primary: '#0f172a', secondary: '#475569' },
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    h4: { fontWeight: 800, letterSpacing: '-0.03em', color: '#ff8832' },
    subtitle1: { color: '#475569' }
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
          '&.Mui-error fieldset': { borderColor: '#f87171' }
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontWeight: 600, color: '#0f172a' }
      }
    },
    MuiButton: {
      styleOverrides: { 
        root: { 
          textTransform: 'none', 
          fontWeight: 700,
          letterSpacing: '0.04em',
          borderRadius: 100,
        } 
      },
    },
  },
});

export default function CadastroUsuario() {
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<ICadastroUsuario>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      tipo: '' as 'USUARIO' | 'PRODUTOR',
      telefoneContato: '',
      cnpj: '',
      nomeEmpresa: '',
    },
  });

  const tipoSelecionado = watch('tipo');

  const onSubmit = (data: ICadastroUsuario) => {
    console.log('Payload:', data);
    setMensagemSucesso(`Usuário ${data.nome} cadastrado com sucesso!`);
    reset();
    setTimeout(() => setMensagemSucesso(''), 5000);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        
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
            borderRadius: { xs: '0 0 32px 32px', md: '0' }
          }}
        >
          <Box sx={{ position: 'absolute', width: 280, height: 280, top: -80, left: -80, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.08)', pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', width: 220, height: 220, bottom: -60, right: -60, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.08)', pointerEvents: 'none' }} />

          <Box sx={{ width: 90, height: 90, borderRadius: '50%', bgcolor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, position: 'relative', zIndex: 1, overflow: 'hidden' }}>
            <Box component="img" src="src/assets/painel-logo-img.jpeg" alt="Nutristack" sx={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.5) translateX(1.5px)' }} />
          </Box>
          
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px', mb: 3, position: 'relative', zIndex: 1 }}>
            NutriStack
          </Typography>
          
          <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.25, mb: 1.5, position: 'relative', zIndex: 1 }}>
            Bem-vindo<br />de volta!
          </Typography>
          
          <Typography sx={{ fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.65, mb: 4, position: 'relative', zIndex: 1, maxWidth: '280px' }}>
            Para continuar conectado,<br />entre com suas informações pessoais.
          </Typography>
          
          <Button 
            href="/login"
            variant="outlined" 
            sx={{ 
              color: '#ffffff', borderColor: '#ffffff', borderWidth: '2px', px: 4, py: 1, position: 'relative', zIndex: 1,
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.15)', borderWidth: '2px', borderColor: '#ffffff' }
            }}
          >
            JÁ TENHO CONTA
          </Button>
        </Box>

        <Box
          sx={{
            flex: 1,
            bgcolor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: { xs: 3, md: 6, lg: 8 },
            overflowY: 'auto'
          }}
        >
          <Box sx={{ maxWidth: '800px', width: '100%', mx: 'auto' }}>
            
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Typography variant="h4" sx={{ mb: 1 }}>Criar Conta</Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '1rem' }}>Preencha os dados para registrar um novo acesso</Typography>
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
                  <Controller name="nome" control={control} render={({ field }) => (
                    <TextField {...field} label={<>Nome Completo <Box component="span" sx={{color: '#ef4444'}}>*</Box></>} placeholder="Digite o nome completo" error={!!errors.nome} helperText={errors.nome?.message} fullWidth />
                  )} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller name="email" control={control} render={({ field }) => (
                    <TextField {...field} label={<>E-mail <Box component="span" sx={{color: '#ef4444'}}>*</Box></>} type="email" placeholder="exemplo@nutristack.com" error={!!errors.email} helperText={errors.email?.message} fullWidth />
                  )} />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Controller name="senha" control={control} render={({ field }) => (
                    <TextField {...field} label={<>Senha <Box component="span" sx={{color: '#ef4444'}}>*</Box></>} type="password" placeholder="Mínimo 6 caracteres" error={!!errors.senha} helperText={errors.senha?.message} fullWidth />
                  )} />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Controller name="tipo" control={control} render={({ field }) => (
                    <FormControl fullWidth error={!!errors.tipo}>
                      <InputLabel>Perfil de Acesso <Box component="span" sx={{color: '#ef4444'}}>*</Box></InputLabel>
                      <Select {...field} label={<>Perfil de Acesso <Box component="span" sx={{color: '#ef4444'}}>*</Box></>}>
                        <MenuItem value=""><em>Selecione um perfil...</em></MenuItem>
                        <MenuItem value="USUARIO">Usuário Comum</MenuItem>
                        <MenuItem value="PRODUTOR">Produtor</MenuItem>
                      </Select>
                      {errors.tipo && <FormHelperText>{errors.tipo.message}</FormHelperText>}
                    </FormControl>
                  )} />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Controller name="telefoneContato" control={control} render={({ field }) => (
                    <TextField {...field} label={<>Telefone <Box component="span" sx={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.85rem'}}>(Opcional)</Box></>} placeholder="(00) 00000-0000" fullWidth />
                  )} />
                </Grid>

                {tipoSelecionado === 'PRODUTOR' && (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{
                      bgcolor: '#fff7ed', border: '1px dashed #ff8832', borderRadius: '12px', p: 3, mt: 1,
                      animation: 'fadeIn 0.2s ease-out',
                      '@keyframes fadeIn': { from: { opacity: 0, transform: 'translateY(-5px)' }, to: { opacity: 1, transform: 'translateY(0)' } }
                    }}>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: '#fc813f', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 2 }}>
                        Especificações de Produtor
                      </Typography>
                      <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Controller name="cnpj" control={control} render={({ field }) => (
                            <TextField {...field} label={<>CNPJ <Box component="span" sx={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.85rem'}}>(Opcional)</Box></>} placeholder="00.000.000/0000-00" fullWidth />
                          )} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Controller name="nomeEmpresa" control={control} render={({ field }) => (
                            <TextField {...field} label={<>Nome da Empresa <Box component="span" sx={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.85rem'}}>(Opcional)</Box></>} placeholder="Nome Fantasia" fullWidth />
                          )} />
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                )}

                <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
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
                      boxShadow: isValid ? '0 8px 16px -4px rgba(249, 115, 22, 0.25)' : 'none',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover:not(:disabled)': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 20px -4px rgba(249, 115, 22, 0.25)'
                      }
                    }}
                  >
                    {isSubmitting ? 'Processando...' : 'Registrar Usuário'}
                  </Button>
                </Grid>

              </Grid>
            </Box>

            <Box sx={{ mt: 5, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                NutriStack - EB © 2026
              </Typography>
            </Box>

          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}