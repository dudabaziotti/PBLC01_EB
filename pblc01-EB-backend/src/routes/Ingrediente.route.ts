import type { FastifyInstance } from 'fastify';
import { ingredienteController } from '../controllers/Ingredientecontroller.js';
import {
  deleteIngredienteByIdSchema,
  getIngredienteByIdSchema,
  getIngredienteSchema,
  postIngredienteSchema,
  putIngredienteByIdSchema,
} from '../schemas/Ingrediente.schema.js';

async function ingredientesRoutes(fastify: FastifyInstance) {
  fastify.get('/', getIngredienteSchema, ingredienteController.get);
  fastify.get('/:id', getIngredienteByIdSchema, ingredienteController.getParamId);
  fastify.post('/', postIngredienteSchema, ingredienteController.post);
  fastify.put('/:id', putIngredienteByIdSchema, ingredienteController.putParamId);
  fastify.delete('/:id', deleteIngredienteByIdSchema, ingredienteController.deleteParamId);
}
export default ingredientesRoutes;