import type { FastifyInstance } from 'fastify';
import { rotuloController } from '../controllers/Rotulocontroller.js';
import {
  deleteRotuloByIdSchema,
  getRotuloByIdSchema,
  getRotuloSchema,
  postRotuloSchema,
  putRotuloByIdSchema,
} from '../schemas/Rotulo.schema.js';

async function rotulosRoutes(fastify: FastifyInstance) {
  fastify.get('/', getRotuloSchema, rotuloController.get);
  fastify.get('/:id', getRotuloByIdSchema, rotuloController.getParamId);
  fastify.post('/', postRotuloSchema, rotuloController.post);
  fastify.put('/:id', putRotuloByIdSchema, rotuloController.putParamId);
  fastify.delete('/:id', deleteRotuloByIdSchema, rotuloController.deleteParamId);
}
export default rotulosRoutes;