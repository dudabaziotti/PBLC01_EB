import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
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
  Grid,
} from '@mui/material';
import api from '../api/axios';

import logoNutriStack from '../assets/painel-logo-img.jpeg';

const schema = yup
  .object({
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
  })
  .required();

type ICadastroUsuario = yup.InferType<typeof schema>;

export default function CadastroUsuario() {
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

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

  const onSubmit = async (data: ICadastroUsuario) => {
    try {
      await api.post('/usuarios', data);
      setMensagemSucesso(`Usuário ${data.nome} cadastrado com sucesso! Redirecionando para o login...`);
      reset();
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao cadastrar usuário');
    }
  };

  return (
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
          borderRadius: { xs: '0 0 32px 32px', md: '0' },
        }}
      >
        <Box sx={{ position: 'absolute', width: 280, height: 280, top: -80, left: -80, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.08)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', width: 220, height: 220, bottom: -60, right: -60, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.08)', pointerEvents: 'none' }} />

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
        <Typography sx={{ fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.65, mb: 4, position: 'relative', zIndex: 1, maxWidth: '280px' }}>
          Para continuar conectado, <br /> entre com suas informações pessoais.
        </Typography>

        <Button
          onClick={() => navigate('/login')}
          variant="outlined"
          sx={{
            color: '#ffffff',
            borderColor: '#ffffff',
            borderWidth: '2px',
            px: 4,
            py: 1,
            position: 'relative',
            zIndex: 1,
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.15)', borderWidth: '2px', borderColor: '#ffffff' },
          }}
        >
          JÁ TENHO CONTA
        </Button>
      </Box>

      <Box
        sx={{
          flex: 1,
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: { xs: 3, md: 6, lg: 8 },
          overflowY: 'auto',
        }}
      >
        <Box sx={{ maxWidth: '800px', width: '100%', mx: 'auto' }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
              Criar Conta
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Preencha os dados para registrar um novo acesso
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
              <Box component="span" sx={{ color: '#ef4444', fontWeight: 700 }}>
                *
              </Box>{' '}
              Campos obrigatórios
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
                  name="nome"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<>Nome Completo <Box component="span" sx={{ color: '#ef4444' }}>*</Box></>}
                      placeholder="Digite o nome completo"
                      error={!!errors.nome}
                      helperText={errors.nome?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<>E-mail <Box component="span" sx={{ color: '#ef4444' }}>*</Box></>}
                      type="email"
                      placeholder="exemplo@nutristack.com"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="senha"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<>Senha <Box component="span" sx={{ color: '#ef4444' }}>*</Box></>}
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      error={!!errors.senha}
                      helperText={errors.senha?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="tipo"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.tipo}>
                      <InputLabel>Perfil de Acesso <Box component="span" sx={{ color: '#ef4444' }}>*</Box></InputLabel>
                      <Select {...field} label="Perfil de Acesso *">
                        <MenuItem value=""><em>Selecione um perfil...</em></MenuItem>
                        <MenuItem value="USUARIO">Usuário Comum</MenuItem>
                        <MenuItem value="PRODUTOR">Produtor</MenuItem>
                      </Select>
                      {errors.tipo && <FormHelperText>{errors.tipo.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="telefoneContato"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<>Telefone <Box component="span" sx={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.85rem' }}>(Opcional)</Box></>}
                      placeholder="(00) 00000-0000"
                      fullWidth
                    />
                  )}
                />
              </Grid>

              {tipoSelecionado === 'PRODUTOR' && (
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      bgcolor: '#fff7ed',
                      border: '1px dashed #ff8832',
                      borderRadius: '12px',
                      p: 3,
                      mt: 1,
                    }}
                  >
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: '#fc813f', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 2 }}>
                      Especificações de Produtor
                    </Typography>
                    <Grid container spacing={2.5}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                          name="cnpj"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={<>CNPJ <Box component="span" sx={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.85rem' }}>(Opcional)</Box></>}
                              placeholder="00.000.000/0000-00"
                              fullWidth
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                          name="nomeEmpresa"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={<>Nome da Empresa <Box component="span" sx={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.85rem' }}>(Opcional)</Box></>}
                              placeholder="Nome Fantasia"
                              fullWidth
                            />
                          )}
                        />
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
                    '&:hover:not(:disabled)': { transform: 'translateY(-2px)' },
                  }}
                >
                  {isSubmitting ? 'Processando...' : 'Registrar Usuário'}
                </Button>
              </Grid>
            </Grid>
          </Box>

          {erro && (
            <Alert severity="error" sx={{ mt: 3 }} onClose={() => setErro('')}>
              {erro}
            </Alert>
          )}

          <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center', mt: 5 }}>
            NutriStack - EB © 2026
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}