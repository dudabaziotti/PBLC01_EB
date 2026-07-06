import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { TextField, MenuItem, FormControl, InputLabel, Select, FormHelperText } from '@mui/material';
import EntityCrud from '../components/EntityCrud';
import api from '../api/axios';

const UNIDADES = ['g', 'kg', 'ml', 'l', 'unidade', 'porção'] as const;

const schema = yup.object({
  nome: yup.string().required('O nome é obrigatório').min(2, 'Mínimo 2 caracteres'),
  unidade: yup.string().oneOf(UNIDADES, 'Selecione uma unidade').required('A unidade é obrigatória'),
  fonte: yup.string().required('A fonte é obrigatória'),
  fonteReferenciaId: yup
    .number()
    .typeError('Selecione uma fonte de referência')
    .positive('Selecione uma fonte de referência')
    .integer()
    .required('A fonte de referência é obrigatória'),
});

const defaultValues = {
  nome: '',
  unidade: '',
  fonte: '',
  fonteReferenciaId: '',
};

interface FonteReferencia {
  id: number;
  nomeFonte: string;
}

export default function IngredientesPage() {
  const [fontes, setFontes] = useState<FonteReferencia[]>([]);

  useEffect(() => {
    api
      .get('/fontes')
      .then((res) => setFontes(res.data))
      .catch(() => setFontes([]));
  }, []);

  return (
    <EntityCrud
      title="Ingredientes"
      apiPath="/ingredientes"
      idField="idIngrediente"
      schema={schema}
      defaultValues={defaultValues}
      transformBeforeSubmit={(data) => ({ ...data, fonteReferenciaId: Number(data.fonteReferenciaId) })}
      columns={[
        { field: 'nome', label: 'Nome' },
        { field: 'unidade', label: 'Unidade' },
        { field: 'fonte', label: 'Fonte' },
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
            name="unidade"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.unidade}>
                <InputLabel>Unidade</InputLabel>
                <Select {...field} label="Unidade">
                  {UNIDADES.map((u) => (
                    <MenuItem key={u} value={u}>
                      {u}
                    </MenuItem>
                  ))}
                </Select>
                {errors.unidade && <FormHelperText>{errors.unidade.message as string}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            name="fonte"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Fonte (ex: TACO)" error={!!errors.fonte} helperText={errors.fonte?.message as string} fullWidth />
            )}
          />
          <Controller
            name="fonteReferenciaId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.fonteReferenciaId}>
                <InputLabel>Fonte de Referência</InputLabel>
                <Select {...field} label="Fonte de Referência">
                  <MenuItem value="">
                    <em>Selecione...</em>
                  </MenuItem>
                  {fontes.map((f) => (
                    <MenuItem key={f.id} value={f.id}>
                      {f.nomeFonte}
                    </MenuItem>
                  ))}
                </Select>
                {errors.fonteReferenciaId && (
                  <FormHelperText>{errors.fonteReferenciaId.message as string}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </>
      )}
    />
  );
}
