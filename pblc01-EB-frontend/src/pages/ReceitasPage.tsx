import * as yup from 'yup';
import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import EntityCrud from '../components/EntityCrud';

const schema = yup.object({
  modoPreparo: yup
    .string()
    .required('O modo de preparo é obrigatório')
    .min(20, 'Descreva o preparo com ao menos 20 caracteres'),
  tempoPreparo: yup
    .number()
    .typeError('Informe um número de minutos válido')
    .positive('O tempo deve ser maior que zero')
    .integer('Informe um número inteiro')
    .max(1440, 'O tempo não pode ultrapassar 1440 minutos')
    .required('O tempo de preparo é obrigatório'),
  rendimentoPorcoes: yup
    .number()
    .typeError('Informe um número válido de porções')
    .positive('O rendimento deve ser maior que zero')
    .integer('Informe um número inteiro')
    .max(999, 'Valor máximo: 999 porções')
    .required('O rendimento em porções é obrigatório'),
});

const defaultValues = {
  modoPreparo: '',
  tempoPreparo: '',
  rendimentoPorcoes: '',
};

export default function ReceitasPage() {
  return (
    <EntityCrud
      title="Receitas"
      apiPath="/receitas"
      idField="idReceita"
      schema={schema}
      defaultValues={defaultValues}
      transformBeforeSubmit={(data) => ({
        ...data,
        tempoPreparo: Number(data.tempoPreparo),
        rendimentoPorcoes: Number(data.rendimentoPorcoes),
      })}
      columns={[
        { field: 'modoPreparo', label: 'Modo de Preparo', render: (row) => `${String(row.modoPreparo).slice(0, 60)}...` },
        { field: 'tempoPreparo', label: 'Tempo (min)' },
        { field: 'rendimentoPorcoes', label: 'Porções' },
      ]}
      renderFields={({ control, formState: { errors } }: any) => (
        <>
          <Controller
            name="modoPreparo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Modo de Preparo"
                multiline
                rows={4}
                error={!!errors.modoPreparo}
                helperText={errors.modoPreparo?.message as string}
                fullWidth
              />
            )}
          />
          <Controller
            name="tempoPreparo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Tempo de Preparo (min)"
                type="number"
                error={!!errors.tempoPreparo}
                helperText={errors.tempoPreparo?.message as string}
                fullWidth
              />
            )}
          />
          <Controller
            name="rendimentoPorcoes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Rendimento (porções)"
                type="number"
                error={!!errors.rendimentoPorcoes}
                helperText={errors.rendimentoPorcoes?.message as string}
                fullWidth
              />
            )}
          />
        </>
      )}
    />
  );
}
