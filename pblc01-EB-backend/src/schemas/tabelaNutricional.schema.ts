const tabelaNutricionalSchema = {
  type: 'object',
  properties: {
    idTabela:        { type: 'integer' },
    dados:           { type: 'string' },
    formato:         { type: 'string' },
    medidaCaseiraId: { type: 'integer' },
    fichaTecnicaId:  { type: 'string', nullable: true },
  },
} as const;

const tabelaNutricionalBodySchema = {
  type: 'object',
  required: ['dados', 'formato', 'medidaCaseiraId'],
  properties: {
    dados:           { type: 'string' },
    formato:         { type: 'string' },
    medidaCaseiraId: { type: 'integer' },
    fichaTecnicaId:  { type: 'string' },
  },
} as const;

const tabelaNutricionalIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
} as const;

export const getTabelaNutricionalSchema = {
  schema: { tags: ['Tabelas Nutricionais'], summary: 'Lista todas as tabelas nutricionais', security: [{ bearerAuth: [] }], response: { 200: { type: 'array', items: tabelaNutricionalSchema } } },
};
export const getTabelaNutricionalByIdSchema = {
  schema: { tags: ['Tabelas Nutricionais'], summary: 'Obtém uma tabela nutricional pelo ID', security: [{ bearerAuth: [] }], params: tabelaNutricionalIdParamsSchema, response: { 200: tabelaNutricionalSchema } },
};
export const postTabelaNutricionalSchema = {
  schema: { tags: ['Tabelas Nutricionais'], summary: 'Cria uma nova tabela nutricional', security: [{ bearerAuth: [] }], body: tabelaNutricionalBodySchema, response: { 201: tabelaNutricionalSchema } },
};
export const putTabelaNutricionalByIdSchema = {
  schema: { tags: ['Tabelas Nutricionais'], summary: 'Atualiza uma tabela nutricional pelo ID', security: [{ bearerAuth: [] }], params: tabelaNutricionalIdParamsSchema, body: tabelaNutricionalBodySchema, response: { 200: tabelaNutricionalSchema } },
};
export const deleteTabelaNutricionalByIdSchema = {
  schema: { tags: ['Tabelas Nutricionais'], summary: 'Remove uma tabela nutricional pelo ID', security: [{ bearerAuth: [] }], params: tabelaNutricionalIdParamsSchema, response: { 200: tabelaNutricionalSchema } },
};