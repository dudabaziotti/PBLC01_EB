const rotuloSchema = {
  type: 'object',
  properties: {
    idRotulo:              { type: 'integer' },
    listaAlergenos:        { type: 'string' },
    instrucoesConservacao: { type: 'string' },
    validadeDias:          { type: 'integer' },
    fichaTecnicaId:        { type: 'string', nullable: true },
  },
} as const;

const rotuloBodySchema = {
  type: 'object',
  required: ['listaAlergenos', 'instrucoesConservacao', 'validadeDias'],
  properties: {
    listaAlergenos:        { type: 'string' },
    instrucoesConservacao: { type: 'string' },
    validadeDias:          { type: 'integer' },
    fichaTecnicaId:        { type: 'string' },
  },
} as const;

const rotuloIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
} as const;

export const getRotuloSchema = {
  schema: {
    tags: ['Rótulos'],
    summary: 'Lista todos os rótulos',
    security: [{ bearerAuth: [] }],
    response: { 200: { type: 'array', items: rotuloSchema } },
  },
};

export const getRotuloByIdSchema = {
  schema: {
    tags: ['Rótulos'],
    summary: 'Obtém um rótulo pelo ID',
    security: [{ bearerAuth: [] }],
    params: rotuloIdParamsSchema,
    response: { 200: rotuloSchema },
  },
};

export const postRotuloSchema = {
  schema: {
    tags: ['Rótulos'],
    summary: 'Cria um novo rótulo',
    security: [{ bearerAuth: [] }],
    body: rotuloBodySchema,
    response: { 201: rotuloSchema },
  },
};

export const putRotuloByIdSchema = {
  schema: {
    tags: ['Rótulos'],
    summary: 'Atualiza um rótulo pelo ID',
    security: [{ bearerAuth: [] }],
    params: rotuloIdParamsSchema,
    body: rotuloBodySchema,
    response: { 200: rotuloSchema },
  },
};

export const deleteRotuloByIdSchema = {
  schema: {
    tags: ['Rótulos'],
    summary: 'Remove um rótulo pelo ID',
    security: [{ bearerAuth: [] }],
    params: rotuloIdParamsSchema,
    response: { 200: rotuloSchema },
  },
};