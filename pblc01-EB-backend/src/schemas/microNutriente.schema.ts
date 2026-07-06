const microNutrienteSchema = {
  type: 'object',
  properties: {
    id:            { type: 'integer' },
    nome:          { type: 'string' },
    valor:         { type: 'number' },
    unidade:       { type: 'string' },
    ingredienteId: { type: 'integer', nullable: true },
    tabelaId:      { type: 'integer', nullable: true },
  },
} as const;

const microNutrienteBodySchema = {
  type: 'object',
  required: ['nome', 'valor', 'unidade'],
  properties: {
    nome:          { type: 'string' },
    valor:         { type: 'number' },
    unidade:       { type: 'string' },
    ingredienteId: { type: 'integer' },
    tabelaId:      { type: 'integer' },
  },
} as const;

const microNutrienteIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
} as const;

export const getMicroNutrienteSchema = {
  schema: { tags: ['Micronutrientes'], summary: 'Lista todos os micronutrientes', security: [{ bearerAuth: [] }], response: { 200: { type: 'array', items: microNutrienteSchema } } },
};
export const getMicroNutrienteByIdSchema = {
  schema: { tags: ['Micronutrientes'], summary: 'Obtém um micronutriente pelo ID', security: [{ bearerAuth: [] }], params: microNutrienteIdParamsSchema, response: { 200: microNutrienteSchema } },
};
export const postMicroNutrienteSchema = {
  schema: { tags: ['Micronutrientes'], summary: 'Cria um novo micronutriente', security: [{ bearerAuth: [] }], body: microNutrienteBodySchema, response: { 201: microNutrienteSchema } },
};
export const putMicroNutrienteByIdSchema = {
  schema: { tags: ['Micronutrientes'], summary: 'Atualiza um micronutriente pelo ID', security: [{ bearerAuth: [] }], params: microNutrienteIdParamsSchema, body: microNutrienteBodySchema, response: { 200: microNutrienteSchema } },
};
export const deleteMicroNutrienteByIdSchema = {
  schema: { tags: ['Micronutrientes'], summary: 'Remove um micronutriente pelo ID', security: [{ bearerAuth: [] }], params: microNutrienteIdParamsSchema, response: { 200: microNutrienteSchema } },
};