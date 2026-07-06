const fonteReferenciaSchema = {
  type: 'object',
  properties: {
    id:            { type: 'integer' },
    linkFonte:     { type: 'string' },
    nomeFonte:     { type: 'string' },
    anoPublicacao: { type: 'string' },
  },
} as const;

const fonteReferenciaBodySchema = {
  type: 'object',
  required: ['linkFonte', 'nomeFonte', 'anoPublicacao'],
  properties: {
    linkFonte:     { type: 'string' },
    nomeFonte:     { type: 'string' },
    anoPublicacao: { type: 'string' },
  },
} as const;

const fonteReferenciaIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
} as const;

export const getFonteReferenciaSchema = {
  schema: { tags: ['Fontes de Referência'], summary: 'Lista todas as fontes de referência', security: [{ bearerAuth: [] }], response: { 200: { type: 'array', items: fonteReferenciaSchema } } },
};
export const getFonteReferenciaByIdSchema = {
  schema: { tags: ['Fontes de Referência'], summary: 'Obtém uma fonte de referência pelo ID', security: [{ bearerAuth: [] }], params: fonteReferenciaIdParamsSchema, response: { 200: fonteReferenciaSchema } },
};
export const postFonteReferenciaSchema = {
  schema: { tags: ['Fontes de Referência'], summary: 'Cria uma nova fonte de referência', security: [{ bearerAuth: [] }], body: fonteReferenciaBodySchema, response: { 201: fonteReferenciaSchema } },
};
export const putFonteReferenciaByIdSchema = {
  schema: { tags: ['Fontes de Referência'], summary: 'Atualiza uma fonte de referência pelo ID', security: [{ bearerAuth: [] }], params: fonteReferenciaIdParamsSchema, body: fonteReferenciaBodySchema, response: { 200: fonteReferenciaSchema } },
};
export const deleteFonteReferenciaByIdSchema = {
  schema: { tags: ['Fontes de Referência'], summary: 'Remove uma fonte de referência pelo ID', security: [{ bearerAuth: [] }], params: fonteReferenciaIdParamsSchema, response: { 200: fonteReferenciaSchema } },
};