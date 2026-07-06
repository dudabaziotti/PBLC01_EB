import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@mui/material';
import EntityCrud from '../components/EntityCrud';
import api from '../api/axios';

const FORMATOS_DISPONIVEIS = ['PDF', 'EXCEL', 'CSV', 'JSON'] as const;

const schema = yup.object({
  idFicha: yup
    .string()
    .required('O ID da ficha é obrigatório')
    .min(3, 'Mínimo 3 caracteres')
    .matches(/^[A-Za-z0-9_-]+$/, 'Use apenas letras, números, _ ou -'),
  nomeReceita: yup.string().required('O nome da receita é obrigatório').min(3, 'Mínimo 3 caracteres'),
  autor: yup.string().required('O autor é obrigatório').min(3, 'Mínimo 3 caracteres'),
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
  formatos: yup.array().of(yup.string().oneOf(FORMATOS_DISPONIVEIS)).min(1, 'Selecione ao menos um formato').required(),
  receitaId: yup
    .number()
    .typeError('Selecione uma receita')
    .positive('Selecione uma receita')
    .integer()
    .required('A receita é obrigatória'),
  usuarioId: yup
    .number()
    .typeError('Informe um ID numérico válido')
    .positive('O ID deve ser maior que zero')
    .integer()
    .nullable()
    .optional(),
});

const defaultValues = {
  idFicha: '',
  nomeReceita: '',
  autor: '',
  pesoTotal: '',
  tamanhoPorcao: '',
  formatos: [] as string[],
  receitaId: '',
  usuarioId: '',
};

interface ReceitaOption {
  idReceita: number;
  nome: string;
  modoPreparo: string;
}
interface UsuarioOption {
  idUsuario: number;
  nome: string;
}

export default function FichasTecnicasPage() {
  const [receitas, setReceitas] = useState<ReceitaOption[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioOption[]>([]);

  useEffect(() => {
    api.get('/receitas').then((res) => setReceitas(res.data)).catch(() => setReceitas([]));
    api.get('/usuarios').then((res) => setUsuarios(res.data)).catch(() => setUsuarios([]));
  }, []);

  return (
    <EntityCrud
      title="Fichas Técnicas"
      apiPath="/fichas"
      idField="idFicha"
      schema={schema}
      defaultValues={defaultValues}
      transformBeforeSubmit={(data) => ({
        ...data,
        pesoTotal: Number(data.pesoTotal),
        tamanhoPorcao: Number(data.tamanhoPorcao),
        receitaId: Number(data.receitaId),
        usuarioId: data.usuarioId ? Number(data.usuarioId) : undefined,
      })}
      columns={[
        { field: 'idFicha', label: 'ID' },
        { field: 'nomeReceita', label: 'Nome da Receita' },
        { field: 'autor', label: 'Autor' },
        { field: 'pesoTotal', label: 'Peso Total (g)' },
      ]}
      renderFields={({ control, watch, setValue, formState: { errors } }: any, { isEditing }: { isEditing: boolean }) => {
        const formatosSelecionados: string[] = watch('formatos') ?? [];
        return (
          <>
            <Controller
              name="idFicha"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ID da Ficha"
                  disabled={isEditing}
                  error={!!errors.idFicha}
                  helperText={errors.idFicha?.message as string}
                  fullWidth
                />
              )}
            />

            <Controller
              name="nomeReceita"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.nomeReceita}>
                  <InputLabel>Nome da Receita</InputLabel>
                  <Select 
                    {...field} 
                    label="Nome da Receita"
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      const receitaCorrespondente = receitas.find(r => r.nome === e.target.value);
                      if (receitaCorrespondente) {
                        setValue('receitaId', receitaCorrespondente.idReceita, { shouldValidate: true });
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>Selecione...</em>
                    </MenuItem>
                    {receitas.map((r) => (
                      <MenuItem key={r.idReceita} value={r.nome}>
                        {r.nome}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.nomeReceita && <FormHelperText>{errors.nomeReceita.message as string}</FormHelperText>}
                </FormControl>
              )}
            />

            <Controller
              name="autor"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Autor" error={!!errors.autor} helperText={errors.autor?.message as string} fullWidth />
              )}
            />
            <Controller
              name="pesoTotal"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Peso Total (g)" type="number" error={!!errors.pesoTotal} helperText={errors.pesoTotal?.message as string} fullWidth />
              )}
            />
            <Controller
              name="tamanhoPorcao"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Tamanho da Porção (g)" type="number" error={!!errors.tamanhoPorcao} helperText={errors.tamanhoPorcao?.message as string} fullWidth />
              )}
            />

            <Controller
              name="receitaId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.receitaId}>
                  <InputLabel>Receita ID</InputLabel>
                  <Select 
                    {...field} 
                    label="Receita ID"
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      const receitaCorrespondente = receitas.find(r => r.idReceita === Number(e.target.value));
                      if (receitaCorrespondente) {
                        setValue('nomeReceita', receitaCorrespondente.nome, { shouldValidate: true });
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>Selecione...</em>
                    </MenuItem>
                    {receitas.map((r) => (
                      <MenuItem key={r.idReceita} value={r.idReceita}>
                        #{r.idReceita} - {r.nome}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.receitaId && <FormHelperText>{errors.receitaId.message as string}</FormHelperText>}
                </FormControl>
              )}
            />

            <Controller
              name="usuarioId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.usuarioId}>
                  <InputLabel>Usuário (opcional)</InputLabel>
                  <Select {...field} label="Usuário (opcional)">
                    <MenuItem value="">
                      <em>Nenhum</em>
                    </MenuItem>
                    {usuarios.map((u) => (
                      <MenuItem key={u.idUsuario} value={u.idUsuario}>
                        {u.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              name="formatos"
              control={control}
              render={({ field }) => (
                <FormControl error={!!errors.formatos}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Formatos de Exportação
                  </Typography>
                  <FormGroup row>
                    {FORMATOS_DISPONIVEIS.map((fmt) => {
                      const checked = formatosSelecionados.includes(fmt);
                      return (
                        <FormControlLabel
                          key={fmt}
                          label={fmt}
                          control={
                            <Checkbox
                              checked={checked}
                              onChange={() => {
                                const atual: string[] = field.value ?? [];
                                field.onChange(checked ? atual.filter((f) => f !== fmt) : [...atual, fmt]);
                              }}
                            />
                          }
                        />
                      );
                    })}
                  </FormGroup>
                  {errors.formatos && <FormHelperText>{errors.formatos.message as string}</FormHelperText>}
                </FormControl>
              )}
            />
          </>
        );
      }}
    />
  );
}