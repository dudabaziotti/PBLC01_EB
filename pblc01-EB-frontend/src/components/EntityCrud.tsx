import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Collapse,
  Snackbar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { ObjectSchema } from 'yup';
import Header from './Header';
import api from '../api/axios';

export interface EntityColumn<T> {
  field: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface EntityCrudProps<T extends Record<string, any>> {
  title: string;
  apiPath: string;
  idField: keyof T;
  columns: EntityColumn<T>[];
  schema: ObjectSchema<any>;
  defaultValues: Record<string, any>;
  renderFields: (form: ReturnType<typeof useForm>, ctx: { isEditing: boolean }) => React.ReactNode;
  transformBeforeSubmit?: (data: any) => any;
}

export default function EntityCrud<T extends Record<string, any>>({
  title,
  apiPath,
  idField,
  columns,
  schema,
  defaultValues,
  renderFields,
  transformBeforeSubmit,
}: EntityCrudProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editando, setEditando] = useState<T | null>(null);
  const [excluindoId, setExcluindoId] = useState<string | number | null>(null);

  const form = useForm({
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
    defaultValues,
  });
  const { formState: { isSubmitting, isValid } } = form;

  const carregarItens = async () => {
    setCarregando(true);
    try {
      const response = await api.get(apiPath);
      setItems(response.data);
      setErro('');
    } catch (err: any) {
      setErro(err.response?.data?.message || `Erro ao carregar ${title.toLowerCase()}`);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarItens();
  }, [apiPath]);

  const abrirCriar = () => {
    setEditando(null);
    form.reset(defaultValues);
    setView('form');
  };

  const abrirEditar = (row: T) => {
    setEditando(row);
    const dadosTratados = { ...defaultValues };
    Object.keys(row).forEach((key) => {
      // Se o valor vindo do banco for estritamente 'null', substitui pelo valor padrão (geralmente '')
      dadosTratados[key] = row[key] === null ? (defaultValues[key] ?? '') : row[key];
    });

    form.reset(dadosTratados as any);      
    setView('form');
  };

  const voltarParaLista = () => {
    setView('list');
    setEditando(null);
  };

  const onSubmit = async (data: any) => {
    const payload = transformBeforeSubmit ? transformBeforeSubmit(data) : data;
    try {
      if (editando) {
        const id = editando[idField];
        await api.put(`${apiPath}/${id}`, payload);
        setMensagemSucesso('Registro atualizado com sucesso!');
      } else {
        await api.post(apiPath, payload);
        setMensagemSucesso('Registro criado com sucesso!');
      }
      voltarParaLista();
      carregarItens();
      setTimeout(() => setMensagemSucesso(''), 5000);
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao salvar registro');
    }
  };

  const excluir = async () => {
    if (excluindoId === null) return;
    try {
      await api.delete(`${apiPath}/${excluindoId}`);
      setMensagemSucesso('Registro excluído com sucesso!');
      setExcluindoId(null);
      carregarItens();
      setTimeout(() => setMensagemSucesso(''), 5000);
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao excluir registro');
      setExcluindoId(null);
    }
  };

  if (view === 'form') {
    return (
      <>
        <Header />
        <Box
          sx={{
            minHeight: 'calc(100vh - 64px)',
            bgcolor: 'background.default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 3, md: 6 },
          }}
        >
          <Box
            sx={{
              maxWidth: '700px',
              width: '100%',
              bgcolor: 'background.paper',
              borderRadius: 3,
              p: { xs: 3, md: 5 },
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
                {editando ? `Editar ${title}` : `Cadastrar ${title}`}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                Preencha as informações abaixo
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
                <Box component="span" sx={{ color: '#ef4444', fontWeight: 700 }}>
                  *
                </Box>{' '}
                Campos obrigatórios
              </Typography>
            </Box>

            <Box
              component="form"
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
            >
              {renderFields(form, { isEditing: !!editando })}

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={voltarParaLista}>
                  Voltar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || !isValid}
                  sx={{
                    minWidth: 200,
                    py: 1.2,
                    background: isValid
                      ? 'linear-gradient(135deg, #ff8832 0%, #ea580c 100%)'
                      : undefined,
                    boxShadow: isValid ? '0 8px 16px -4px rgba(249,115,22,0.25)' : 'none',
                    '&:hover:not(:disabled)': { transform: 'translateY(-2px)' },
                  }}
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        <Snackbar open={!!erro} autoHideDuration={4000} onClose={() => setErro('')}>
          <Alert severity="error" onClose={() => setErro('')}>
            {erro}
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gerencie os registros de {title.toLowerCase()}
          </Typography>
        </Box>

        <Collapse in={!!mensagemSucesso}>
          <Alert
            severity="success"
            sx={{ mb: 3, bgcolor: '#dcfce7', color: '#15803d', border: '1px solid #86efac', borderRadius: 2 }}
            onClose={() => setMensagemSucesso('')}
          >
            {mensagemSucesso}
          </Alert>
        </Collapse>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            onClick={abrirCriar}
            sx={{
              background: 'linear-gradient(135deg, #ff8832 0%, #ea580c 100%)',
              boxShadow: '0 8px 16px -4px rgba(249,115,22,0.25)',
              px: 3,
            }}
          >
            + Novo
          </Button>
        </Box>

        {carregando ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={String(col.field)} sx={{ fontWeight: 700 }}>
                      {col.label}
                    </TableCell>
                  ))}
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} align="center">
                      Nenhum registro encontrado.
                    </TableCell>
                  </TableRow>
                )}
                {items.map((row) => (
                  <TableRow key={String(row[idField])} hover>
                    {columns.map((col) => (
                      <TableCell key={String(col.field)}>
                        {col.render ? col.render(row) : String(row[col.field] ?? '')}
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      <IconButton sx={{ color: 'primary.main' }} onClick={() => abrirEditar(row)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton sx={{ color: '#ef4444' }} onClick={() => setExcluindoId(row[idField])}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center', mt: 4 }}>
          NutriStack - EB © 2026
        </Typography>
      </Container>

      <Collapse in={excluindoId !== null}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'background.paper',
            border: '1px solid #f87171',
            borderRadius: 2,
            p: 2,
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            zIndex: 1300,
          }}
        >
          <Typography variant="body2">Confirma a exclusão deste registro?</Typography>
          <Button size="small" onClick={() => setExcluindoId(null)}>
            Cancelar
          </Button>
          <Button size="small" variant="contained" color="error" onClick={excluir}>
            Excluir
          </Button>
        </Box>
      </Collapse>

      <Snackbar open={!!erro} autoHideDuration={4000} onClose={() => setErro('')}>
        <Alert severity="error" onClose={() => setErro('')}>
          {erro}
        </Alert>
      </Snackbar>
    </>
  );
}