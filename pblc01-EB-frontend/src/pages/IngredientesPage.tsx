import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { TextField, MenuItem, FormControl, InputLabel, Select, FormHelperText, Box, Typography } from '@mui/material';
import EntityCrud from '../components/EntityCrud';
import api from '../api/axios';

const UNIDADES = ['g', 'kg', 'ml', 'l', 'unidade', 'porção'] as const;

const NUTRIENTES_PADRAO = [
  { nome: 'Cálcio', unidade: 'mg' },
  { nome: 'Ferro', unidade: 'mg' },
  { nome: 'Sódio', unidade: 'mg' },
  { nome: 'Potássio', unidade: 'mg' },
  { nome: 'Vitamina A', unidade: 'mcg' },
  { nome: 'Vitamina D', unidade: 'mcg' },
  { nome: 'Vitamina B2', unidade: 'mg' },
];

const schema = yup.object({
  nome: yup.string().required('O nome é obrigatório').min(2, 'Mínimo 2 caracteres'),
  quantidade: yup
    .number()
    .typeError('Informe um valor numérico válido')
    .positive('A quantidade deve ser maior que zero')
    .required('A quantidade é obrigatória'),
  unidade: yup.string().oneOf(UNIDADES, 'Selecione uma unidade').required('A unidade é obrigatória'),
  fonte: yup.string().required('A fonte é obrigatória'),
  fonteReferenciaId: yup
    .number()
    .typeError('Selecione uma fonte de referência')
    .positive('Selecione uma fonte de referência')
    .integer()
    .required('A fonte de referência é obrigatória'),
  micronutrientes: yup
    .array()
    .of(
      yup.object({
        nome: yup.string().required(),
        valor: yup
          .number()
          .typeError('Digite o valor')
          .min(0, 'O valor não pode ser negativo')
          .required('O valor é obrigatório'),
        unidade: yup.string().required(),
      })
    )
    .required(),
});

const defaultValues = {
  nome: '',
  quantidade: '',
  unidade: '',
  fonte: '',
  fonteReferenciaId: '',
  micronutrientes: NUTRIENTES_PADRAO.map((n) => ({
    nome: n.nome,
    valor: 0,
    unidade: n.unidade,
  })),
};

interface FonteReferencia {
  id: number;
  nomeFonte: string;
}

function IngredienteFormFields({ form, fontes }: { form: any; fontes: FonteReferencia[] }) {
  const { control, formState: { errors } } = form;
  const { fields } = useFieldArray({
    control,
    name: 'micronutrientes',
  });

  return (
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
        name="quantidade"
        control={control}
        render={({ field }) => (
          <TextField 
            {...field} 
            label="Quantidade Base" 
            type="number"
            slotProps={{ htmlInput: { step: 'any' } }}
            error={!!errors.quantidade} 
            helperText={errors.quantidade?.message as string} 
            fullWidth 
          />
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

      <Box sx={{ mt: 1, mb: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 700 }}>
          Micronutrientes Obrigatórios (Valores por quantidade base)
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {fields.map((item, index) => (
            <Box key={item.id} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Controller
                name={`micronutrientes.${index}.nome`}
                control={control}
                render={({ field: nameField }) => (
                  <TextField
                    {...nameField}
                    label="Nutriente"
                    slotProps={{ htmlInput: { readOnly: true } }}
                    sx={{ 
                      bgcolor: '#f8fafc',
                      '& .MuiInputBase-input': { color: 'text.primary', fontWeight: 600 }
                    }}
                    fullWidth
                  />
                )}
              />

              <Controller
                name={`micronutrientes.${index}.valor`}
                control={control}
                render={({ field: valorField }) => (
                  <TextField
                    {...valorField}
                    label="Teor / Valor"
                    type="number"
                    slotProps={{ htmlInput: { step: 'any' } }}
                    error={!!(errors.micronutrientes as any)?.[index]?.valor}
                    helperText={(errors.micronutrientes as any)?.[index]?.valor?.message as string}
                    sx={{ width: '200px' }}
                  />
                )}
              />

              <Controller
                name={`micronutrientes.${index}.unidade`}
                control={control}
                render={({ field: uniField }) => (
                  <TextField
                    {...uniField}
                    label="Unidade"
                    slotProps={{ htmlInput: { readOnly: true } }}
                    sx={{ 
                      width: '120px', 
                      bgcolor: '#f8fafc',
                      '& .MuiInputBase-input': { color: 'text.secondary', fontWeight: 500 }
                    }}
                  />
                )}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
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
      transformBeforeSubmit={(data) => ({ 
        ...data, 
        fonteReferenciaId: Number(data.fonteReferenciaId), 
        quantidade: Number(data.quantidade),
        micronutrientes: data.micronutrientes.map((m: any) => ({
          nome: m.nome,
          valor: Number(m.valor),
          unidade: m.unidade
        }))
      })}
      transformOnEdit={(data) => {
        const vindosDoBanco = data.microNutrientes ?? data.micronutrientes ?? [];
        const micronutrientesGarantidos = NUTRIENTES_PADRAO.map((padrao) => {
          const encontrado = vindosDoBanco.find(
            (m: any) => m.nome.toLowerCase() === padrao.nome.toLowerCase()
          );
          return {
            nome: padrao.nome,
            valor: encontrado ? encontrado.valor : 0,
            unidade: encontrado ? encontrado.unidade : padrao.unidade,
          };
        });
        return {
          ...data,
          micronutrientes: micronutrientesGarantidos,
        };
      }}
      columns={[
        { field: 'nome', label: 'Nome' },
        { field: 'quantidade', label: 'Quantidade' },
        { field: 'unidade', label: 'Unidade' },
        { field: 'fonte', label: 'Fonte' },
      ]}
      renderFields={(form: any) => (
        <IngredienteFormFields form={form} fontes={fontes} />
      )}
    />
  );
}