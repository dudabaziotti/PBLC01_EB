import type { FastifyInstance } from 'fastify';
import { receitaController } from '../controllers/Receitacontroller.js';
import {
  deleteReceitaByIdSchema,
  getReceitaByIdSchema,
  getReceitaSchema,
  postReceitaSchema,
  putReceitaByIdSchema,
} from '../schemas/Receita.schema.js';

async function receitasRoutes(fastify: FastifyInstance) {
  fastify.get('/', getReceitaSchema, receitaController.get);
  fastify.get('/:id', getReceitaByIdSchema, receitaController.getParamId);
  fastify.post('/', postReceitaSchema, receitaController.post);
  fastify.put('/:id', putReceitaByIdSchema, receitaController.putParamId);
  fastify.delete('/:id', deleteReceitaByIdSchema, receitaController.deleteParamId);
}
export default receitasRoutes;