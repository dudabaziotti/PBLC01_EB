import type { FastifyInstance } from 'fastify';
import { medidaCaseiraController } from '../controllers/MedidaCaseiraController.js';
import { deleteMedidaCaseiraByIdSchema, getMedidaCaseiraByIdSchema, getMedidaCaseiraSchema, postMedidaCaseiraSchema, putMedidaCaseiraByIdSchema } from '../schemas/medidaCaseira.schema.js';

async function medidasCaseirasRoutes(fastify: FastifyInstance) {
  fastify.get('/', getMedidaCaseiraSchema, medidaCaseiraController.get);
  fastify.get('/:id', getMedidaCaseiraByIdSchema, medidaCaseiraController.getParamId);
  fastify.post('/', postMedidaCaseiraSchema, medidaCaseiraController.post);
  fastify.put('/:id', putMedidaCaseiraByIdSchema, medidaCaseiraController.putParamId);
  fastify.delete('/:id', deleteMedidaCaseiraByIdSchema, medidaCaseiraController.deleteParamId);
}
export default medidasCaseirasRoutes;