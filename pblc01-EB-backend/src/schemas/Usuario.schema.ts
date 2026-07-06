const usuarioSchema = {
  type: 'object',
  properties: {
    idUsuario:       { type: 'integer' },
    nome:            { type: 'string' },
    email:           { type: 'string' },
    tipo:            { type: 'string', enum: ['USUARIO', 'PRODUTOR', 'ADMINISTRADOR'] },
    cnpj:            { type: 'string', nullable: true },
    nomeEmpresa:     { type: 'string', nullable: true },
    telefoneContato: { type: 'string', nullable: true },
    nivelPrivilegio: { type: 'string', nullable: true },
  },
} as const;

const usuarioBodySchema = {
  type: 'object',
  required: ['nome', 'email', 'senha', 'tipo'],
  properties: {
    nome:            { type: 'string' },
    email:           { type: 'string' },
    senha:           { type: 'string' },
    tipo:            { type: 'string', enum: ['USUARIO', 'PRODUTOR', 'ADMINISTRADOR'] },
    cnpj:            { type: 'string' },
    nomeEmpresa:     { type: 'string' },
    telefoneContato: { type: 'string' },
    nivelPrivilegio: { type: 'string' },
  },
} as const;

const usuarioIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
} as const;

export const getUsuarioSchema = {
  schema: {
    tags: ['Usuários'],
    summary: 'Lista todos os usuários',
    security: [{ bearerAuth: [] }],
    response: { 200: { type: 'array', items: usuarioSchema } },
  },
};

export const getUsuarioByIdSchema = {
  schema: {
    tags: ['Usuários'],
    summary: 'Obtém um usuário pelo ID',
    security: [{ bearerAuth: [] }],
    params: usuarioIdParamsSchema,
    response: { 200: usuarioSchema },
  },
};

export const postUsuarioSchema = {
  schema: {
    tags: ['Usuários'],
    summary: 'Cria um novo usuário',
    security: [{ bearerAuth: [] }],
    body: usuarioBodySchema,
    response: { 201: usuarioSchema },
  },
};

export const putUsuarioByIdSchema = {
  schema: {
    tags: ['Usuários'],
    summary: 'Atualiza um usuário pelo ID',
    security: [{ bearerAuth: [] }],
    params: usuarioIdParamsSchema,
    body: usuarioBodySchema,
    response: { 200: usuarioSchema },
  },
};

export const deleteUsuarioByIdSchema = {
  schema: {
    tags: ['Usuários'],
    summary: 'Remove um usuário pelo ID',
    security: [{ bearerAuth: [] }],
    params: usuarioIdParamsSchema,
    response: { 200: usuarioSchema },
  },
};