const medidaCaseiraSchema = {
  type: 'object',
  properties: {
    id:                  { type: 'integer' },
    descricao:           { type: 'string' },
    gramagemEquivalente: { type: 'number' },
    valor:               { type: 'number' },
    ingredienteId:       { type: 'integer', nullable: true },
  },
} as const;

const medidaCaseiraBodySchema = {
  type: 'object',
  required: ['descricao', 'gramagemEquivalente', 'valor'],
  properties: {
    descricao:           { type: 'string' },
    gramagemEquivalente: { type: 'number' },
    valor:               { type: 'number' },
    ingredienteId:       { type: 'integer' },
  },
} as const;

const medidaCaseiraIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
} as const;

export const getMedidaCaseiraSchema = {
  schema: { tags: ['Medidas Caseiras'], summary: 'Lista todas as medidas caseiras', security: [{ bearerAuth: [] }], response: { 200: { type: 'array', items: medidaCaseiraSchema } } },
};
export const getMedidaCaseiraByIdSchema = {
  schema: { tags: ['Medidas Caseiras'], summary: 'Obtém uma medida caseira pelo ID', security: [{ bearerAuth: [] }], params: medidaCaseiraIdParamsSchema, response: { 200: medidaCaseiraSchema } },
};
export const postMedidaCaseiraSchema = {
  schema: { tags: ['Medidas Caseiras'], summary: 'Cria uma nova medida caseira', security: [{ bearerAuth: [] }], body: medidaCaseiraBodySchema, response: { 201: medidaCaseiraSchema } },
};
export const putMedidaCaseiraByIdSchema = {
  schema: { tags: ['Medidas Caseiras'], summary: 'Atualiza uma medida caseira pelo ID', security: [{ bearerAuth: [] }], params: medidaCaseiraIdParamsSchema, body: medidaCaseiraBodySchema, response: { 200: medidaCaseiraSchema } },
};
export const deleteMedidaCaseiraByIdSchema = {
  schema: { tags: ['Medidas Caseiras'], summary: 'Remove uma medida caseira pelo ID', security: [{ bearerAuth: [] }], params: medidaCaseiraIdParamsSchema, response: { 200: medidaCaseiraSchema } },
};