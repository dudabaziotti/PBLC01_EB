const fichaTecnicaSchema = {
  type: 'object',
  properties: {
    idFicha:       { type: 'string' },
    nomeReceita:   { type: 'string' },
    autor:         { type: 'string' },
    pesoTotal:     { type: 'number' },
    tamanhoPorcao: { type: 'number' },
    formatos:      { type: 'array', items: { type: 'string' } },
    receitaId:     { type: 'integer' },
    usuarioId:     { type: 'integer', nullable: true },
  },
} as const;

const fichaTecnicaBodySchema = {
  type: 'object',
  required: ['idFicha', 'nomeReceita', 'autor', 'pesoTotal', 'tamanhoPorcao', 'receitaId'],
  properties: {
    idFicha:       { type: 'string' },
    nomeReceita:   { type: 'string' },
    autor:         { type: 'string' },
    pesoTotal:     { type: 'number' },
    tamanhoPorcao: { type: 'number' },
    formatos:      { type: 'array', items: { type: 'string' } },
    receitaId:     { type: 'integer' },
    usuarioId:     { type: 'integer' },
  },
} as const;

const fichaTecnicaIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
} as const;

const fichaTecnicaIngredienteParamsSchema = {
  type: 'object',
  required: ['id', 'ingredienteId'],
  properties: {
    id:            { type: 'string' },
    ingredienteId: { type: 'string' },
  },
} as const;

export const getFichaTecnicaSchema = {
  schema: {
    tags: ['Fichas Técnicas'],
    summary: 'Lista todas as fichas técnicas',
    security: [{ bearerAuth: [] }],
    response: { 200: { type: 'array', items: fichaTecnicaSchema } },
  },
};

export const getFichaTecnicaByIdSchema = {
  schema: {
    tags: ['Fichas Técnicas'],
    summary: 'Obtém uma ficha técnica pelo ID',
    security: [{ bearerAuth: [] }],
    params: fichaTecnicaIdParamsSchema,
    response: { 200: fichaTecnicaSchema },
  },
};

export const postFichaTecnicaSchema = {
  schema: {
    tags: ['Fichas Técnicas'],
    summary: 'Cria uma nova ficha técnica',
    security: [{ bearerAuth: [] }],
    body: fichaTecnicaBodySchema,
    response: { 201: fichaTecnicaSchema },
  },
};

export const putFichaTecnicaByIdSchema = {
  schema: {
    tags: ['Fichas Técnicas'],
    summary: 'Atualiza uma ficha técnica pelo ID',
    security: [{ bearerAuth: [] }],
    params: fichaTecnicaIdParamsSchema,
    body: fichaTecnicaBodySchema,
    response: { 200: fichaTecnicaSchema },
  },
};

export const deleteFichaTecnicaByIdSchema = {
  schema: {
    tags: ['Fichas Técnicas'],
    summary: 'Remove uma ficha técnica pelo ID',
    security: [{ bearerAuth: [] }],
    params: fichaTecnicaIdParamsSchema,
    response: { 200: fichaTecnicaSchema },
  },
};

export const postFichaTecnicaIngredienteSchema = {
  schema: {
    tags: ['Fichas Técnicas'],
    summary: 'Adiciona um ingrediente a uma ficha técnica',
    security: [{ bearerAuth: [] }],
    params: fichaTecnicaIngredienteParamsSchema,
    response: { 201: { type: 'object', properties: { message: { type: 'string' } } } },
  },
};