import type { FastifyInstance } from 'fastify';
import { fonteReferenciaController } from '../controllers/FonteReferenciaController.js';
import { deleteFonteReferenciaByIdSchema, getFonteReferenciaByIdSchema, getFonteReferenciaSchema, postFonteReferenciaSchema, putFonteReferenciaByIdSchema } from '../schemas/fonteReferencia.schema.js';

async function fontesReferenciaRoutes(fastify: FastifyInstance) {
  fastify.get('/', getFonteReferenciaSchema, fonteReferenciaController.get);
  fastify.get('/:id', getFonteReferenciaByIdSchema, fonteReferenciaController.getParamId);
  fastify.post('/', postFonteReferenciaSchema, fonteReferenciaController.post);
  fastify.put('/:id', putFonteReferenciaByIdSchema, fonteReferenciaController.putParamId);
  fastify.delete('/:id', deleteFonteReferenciaByIdSchema, fonteReferenciaController.deleteParamId);
}
export default fontesReferenciaRoutes;