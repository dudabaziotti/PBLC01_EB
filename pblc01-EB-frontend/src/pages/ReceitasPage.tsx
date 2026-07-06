import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { TextField, MenuItem, FormControl, InputLabel, Select, FormHelperText, Box, Button, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EntityCrud from '../components/EntityCrud';
import api from '../api/axios';

const schema = yup.object({
  nome: yup
    .string()
    .required('O nome da receita é obrigatório')
    .min(3, 'O nome deve ter pelo menos 3 caracteres'),
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
  ingredientes: yup
    .array()
    .of(
      yup.object({
        ingredienteId: yup.number().required('Selecione o ingrediente'),
        quantidade: yup
          .number()
          .typeError('Digite a quantidade')
          .positive('Deve ser maior que zero')
          .required('A quantidade é obrigatória'),
      })
    )
    .min(1, 'Selecione pelo menos um ingrediente para a receita')
    .required('Os ingredientes são obrigatórios'),
});

const defaultValues = {
  nome: '',
  modoPreparo: '',
  tempoPreparo: '',
  rendimentoPorcoes: '',
  ingredientes: [],
};

interface IngredienteDisponivel {
  idIngrediente: number;
  nome: string;
  unidade: string;
}

function ReceitaFormFields({ form, ingredientesDisponiveis }: { form: any; ingredientesDisponiveis: IngredienteDisponivel[] }) {
  const { control, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredientes',
  });

  return (
    <>
      <Controller
        name="nome"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Nome da Receita"
            error={!!errors.nome}
            helperText={errors.nome?.message as string}
            fullWidth
          />
        )}
      />

      <Box sx={{ mt: 1, mb: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 700 }}>
          Ingredientes e Quantidades
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 1 }}>
          {fields.map((item, index) => (
            <Box key={item.id} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <FormControl fullWidth error={!!(errors.ingredientes as any)?.[index]?.ingredienteId}>
                <InputLabel>Ingrediente</InputLabel>
                <Controller
                  name={`ingredientes.${index}.ingredienteId`}
                  control={control}
                  render={({ field: selectField }) => (
                    <Select {...selectField} label="Ingrediente">
                      {ingredientesDisponiveis.map((ing) => (
                        <MenuItem key={ing.idIngrediente} value={ing.idIngrediente}>
                          {ing.nome} ({ing.unidade})
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {(errors.ingredientes as any)?.[index]?.ingredienteId && (
                  <FormHelperText>{(errors.ingredientes as any)?.[index]?.ingredienteId?.message}</FormHelperText>
                )}
              </FormControl>

              <Controller
                name={`ingredientes.${index}.quantidade`}
                control={control}
                render={({ field: qtyField }) => (
                  <TextField
                    {...qtyField}
                    label="Quantidade"
                    type="number"
                    slotProps={{ htmlInput: { step: 'any' } }}
                    error={!!(errors.ingredientes as any)?.[index]?.quantidade}
                    helperText={(errors.ingredientes as any)?.[index]?.quantidade?.message as string}
                    sx={{ width: '180px' }}
                  />
                )}
              />

              <IconButton color="error" sx={{ mt: 1 }} onClick={() => remove(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>

        <Button 
          variant="outlined" 
          size="small" 
          onClick={() => append({ ingredienteId: '', quantidade: '' })}
          sx={{ borderRadius: 2, mt: 1 }}
        >
          + Adicionar Ingrediente
        </Button>
        
        {errors.ingredientes?.message && (
          <FormHelperText error sx={{ mt: 1, ml: 1 }}>
            {errors.ingredientes.message as string}
          </FormHelperText>
        )}
      </Box>

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
  );
}

export default function ReceitasPage() {
  const [ingredientesDisponiveis, setIngredientesDisponiveis] = useState<IngredienteDisponivel[]>([]);

  useEffect(() => {
    api
      .get('/ingredientes')
      .then((res) => setIngredientesDisponiveis(res.data))
      .catch(() => setIngredientesDisponiveis([]));
  }, []);

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
        ingredientes: data.ingredientes.map((item: any) => ({
          ingredienteId: Number(item.ingredienteId),
          quantidade: Number(item.quantidade),
        })),
      })}

      transformOnEdit={(data) => ({
        ...data,
        ingredientes: data.ingredientes 
          ? data.ingredientes.map((item: any) => ({
              ingredienteId: item.ingredienteId ?? item.idIngrediente,
              quantidade: item.quantidade,
            }))
          : [],
      })}

      columns={[
        { field: 'nome', label: 'Nome' },
        { field: 'modoPreparo', label: 'Modo de Preparo', render: (row) => `${String(row.modoPreparo).slice(0, 40)}...` },
        { field: 'tempoPreparo', label: 'Tempo (min)' },
        { field: 'rendimentoPorcoes', label: 'Porções' },
      ]}
      renderFields={(form: any) => (
        <ReceitaFormFields form={form} ingredientesDisponiveis={ingredientesDisponiveis} />
      )}
    />
  );
}