import * as yup from 'yup';
import { Controller } from 'react-hook-form';
import { TextField, MenuItem, FormControl, InputLabel, Select, FormHelperText } from '@mui/material';
import EntityCrud from '../components/EntityCrud';

const TIPOS = ['USUARIO', 'PRODUTOR', 'ADMINISTRADOR'] as const;

const schema = yup.object({
  nome: yup.string().required('O nome é obrigatório').min(3, 'Mínimo 3 caracteres'),
  email: yup.string().email('E-mail inválido').required('O e-mail é obrigatório'),
  senha: yup
    .string()
    .test('min-if-present', 'Mínimo 6 caracteres', (v) => !v || v.length >= 6)
    .default(''),
  tipo: yup.string().oneOf(TIPOS, 'Selecione um tipo').required('O tipo é obrigatório'),
  cnpj: yup.string().default(''),
  nomeEmpresa: yup.string().default(''),
  telefoneContato: yup.string().default(''),
  nivelPrivilegio: yup.string().default(''),
});

const defaultValues = {
  nome: '',
  email: '',
  senha: '',
  tipo: 'USUARIO',
  cnpj: '',
  nomeEmpresa: '',
  telefoneContato: '',
  nivelPrivilegio: '',
};

export default function UsuariosPage() {
  return (
    <EntityCrud
      title="Usuários"
      apiPath="/usuarios"
      idField="idUsuario"
      schema={schema}
      defaultValues={defaultValues}
      adminOnly={true}
      transformBeforeSubmit={(data) => {
        let nivel = 'BAIXO';

        if (data.tipo === 'ADMINISTRADOR') {
          nivel = 'ALTO';
        } else if (data.tipo === 'PRODUTOR') {
          nivel = 'MEDIO';
        }
        return {
          ...data,
          nivelPrivilegio: nivel,
        };
      }}
      columns={[
        { field: 'nome', label: 'Nome' },
        { field: 'email', label: 'E-mail' },
        { field: 'tipo', label: 'Tipo' },
      ]}
      renderFields={({ control, formState: { errors } }: any) => (
        <>
          <Controller
            name="nome"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Nome" error={!!errors.nome} helperText={errors.nome?.message as string} fullWidth />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="E-mail" error={!!errors.email} helperText={errors.email?.message as string} fullWidth />
            )}
          />
          <Controller
            name="senha"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Senha"
                type="password"
                placeholder="Deixe em branco para manter a atual"
                error={!!errors.senha}
                helperText={errors.senha?.message as string}
                fullWidth
              />
            )}
          />
          <Controller
            name="tipo"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.tipo}>
                <InputLabel>Tipo</InputLabel>
                <Select {...field} label="Tipo">
                  {TIPOS.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
                {errors.tipo && <FormHelperText>{errors.tipo.message as string}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            name="telefoneContato"
            control={control}
            render={({ field }) => <TextField {...field} label="Telefone (opcional)" fullWidth />}
          />
          <Controller
            name="cnpj"
            control={control}
            render={({ field }) => <TextField {...field} label="CNPJ (opcional)" fullWidth />}
          />
          <Controller
            name="nomeEmpresa"
            control={control}
            render={({ field }) => <TextField {...field} label="Nome da empresa (opcional)" fullWidth />}
          />
        </>
      )}
    />
  );
}