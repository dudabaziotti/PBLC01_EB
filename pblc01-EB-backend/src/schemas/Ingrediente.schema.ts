import type { FastifyInstance } from 'fastify';

const ingredienteMicronutrienteSchema = {
  type: 'object',
  required: ['nome', 'valor', 'unidade'],
  properties: {
    id: { type: 'integer' },
    nome: { type: 'string' },
    valor: { type: 'number' },
    unidade: { type: 'string' },
  },
} as const;

const ingredienteSchema = {
  type: 'object',
  properties: {
    idIngrediente:     { type: 'integer' },
    nome:              { type: 'string' },
    quantidade:        { type: 'number' },
    unidade:           { type: 'string' },
    fonte:             { type: 'string' },
    dataCadastro:      { type: 'string' },
    fonteReferenciaId: { type: 'integer' },
    microNutrientes:   { type: 'array', items: ingredienteMicronutrienteSchema },
  },
} as const;

const ingredienteBodySchema = {
  type: 'object',
  required: ['nome', 'quantidade', 'unidade', 'fonte', 'fonteReferenciaId', 'micronutrientes'],
  properties: {
    nome:              { type: 'string' },
    quantidade:        { type: 'number' },
    unidade:           { type: 'string' },
    fonte:             { type: 'string' },
    fonteReferenciaId: { type: 'integer' },
    micronutrientes:   { type: 'array', items: ingredienteMicronutrienteSchema },
  },
} as const;

const ingredienteIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
} as const;

export const getIngredienteSchema = {
  schema: {
    tags: ['Ingredientes'],
    summary: 'Lista todos os ingredientes',
    security: [{ bearerAuth: [] }],
    response: { 200: { type: 'array', items: ingredienteSchema } },
  },
};

export const getIngredienteByIdSchema = {
  schema: {
    tags: ['Ingredientes'],
    summary: 'Obtém um ingrediente pelo ID',
    security: [{ bearerAuth: [] }],
    params: ingredienteIdParamsSchema,
    response: { 200: ingredienteSchema },
  },
};

export const postIngredienteSchema = {
  schema: {
    tags: ['Ingredientes'],
    summary: 'Cria um novo ingrediente',
    security: [{ bearerAuth: [] }],
    body: ingredienteBodySchema,
    response: { 201: ingredienteSchema },
  },
};

export const putIngredienteByIdSchema = {
  schema: {
    tags: ['Ingredientes'],
    summary: 'Atualiza um ingrediente pelo ID',
    security: [{ bearerAuth: [] }],
    params: ingredienteIdParamsSchema,
    body: ingredienteBodySchema,
    response: { 200: ingredienteSchema },
  },
};

export const deleteIngredienteByIdSchema = {
  schema: {
    tags: ['Ingredientes'],
    summary: 'Remove um ingrediente pelo ID',
    security: [{ bearerAuth: [] }],
    params: ingredienteIdParamsSchema,
    response: { 200: ingredienteSchema },
  },
};