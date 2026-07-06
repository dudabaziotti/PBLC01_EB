const receitaSchema = {
  type: 'object',
  properties: {
    idReceita:         { type: 'integer' },
    modoPreparo:       { type: 'string' },
    tempoPreparo:      { type: 'integer' },
    rendimentoPorcoes: { type: 'integer' },
  },
} as const;

const receitaBodySchema = {
  type: 'object',
  required: ['modoPreparo', 'tempoPreparo', 'rendimentoPorcoes'],
  properties: {
    modoPreparo:       { type: 'string' },
    tempoPreparo:      { type: 'integer' },
    rendimentoPorcoes: { type: 'integer' },
  },
} as const;

const receitaIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
} as const;

export const getReceitaSchema = {
  schema: {
    tags: ['Receitas'],
    summary: 'Lista todas as receitas',
    security: [{ bearerAuth: [] }],
    response: { 200: { type: 'array', items: receitaSchema } },
  },
};

export const getReceitaByIdSchema = {
  schema: {
    tags: ['Receitas'],
    summary: 'Obtém uma receita pelo ID',
    security: [{ bearerAuth: [] }],
    params: receitaIdParamsSchema,
    response: { 200: receitaSchema },
  },
};

export const postReceitaSchema = {
  schema: {
    tags: ['Receitas'],
    summary: 'Cria uma nova receita',
    security: [{ bearerAuth: [] }],
    body: receitaBodySchema,
    response: { 201: receitaSchema },
  },
};

export const putReceitaByIdSchema = {
  schema: {
    tags: ['Receitas'],
    summary: 'Atualiza uma receita pelo ID',
    security: [{ bearerAuth: [] }],
    params: receitaIdParamsSchema,
    body: receitaBodySchema,
    response: { 200: receitaSchema },
  },
};

export const deleteReceitaByIdSchema = {
  schema: {
    tags: ['Receitas'],
    summary: 'Remove uma receita pelo ID',
    security: [{ bearerAuth: [] }],
    params: receitaIdParamsSchema,
    response: { 200: receitaSchema },
  },
};