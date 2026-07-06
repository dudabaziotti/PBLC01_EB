import type { FastifyInstance } from 'fastify';
import { tabelaNutricionalController } from '../controllers/TabelaNutricionalController.js';
import { deleteTabelaNutricionalByIdSchema, getTabelaNutricionalByIdSchema, getTabelaNutricionalSchema, postTabelaNutricionalSchema, putTabelaNutricionalByIdSchema } from '../schemas/tabelaNutricional.schema.js';

async function tabelasNutricionaisRoutes(fastify: FastifyInstance) {
  fastify.get('/', getTabelaNutricionalSchema, tabelaNutricionalController.get);
  fastify.get('/:id', getTabelaNutricionalByIdSchema, tabelaNutricionalController.getParamId);
  fastify.post('/', postTabelaNutricionalSchema, tabelaNutricionalController.post);
  fastify.put('/:id', putTabelaNutricionalByIdSchema, tabelaNutricionalController.putParamId);
  fastify.delete('/:id', deleteTabelaNutricionalByIdSchema, tabelaNutricionalController.deleteParamId);
}
export default tabelasNutricionaisRoutes;