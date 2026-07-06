import type { FastifyInstance } from 'fastify';
import { microNutrienteController } from '../controllers/MicroNutrienteController.js';
import { deleteMicroNutrienteByIdSchema, getMicroNutrienteByIdSchema, getMicroNutrienteSchema, postMicroNutrienteSchema, putMicroNutrienteByIdSchema } from '../schemas/microNutriente.schema.js';

async function microNutrientesRoutes(fastify: FastifyInstance) {
  fastify.get('/', getMicroNutrienteSchema, microNutrienteController.get);
  fastify.get('/:id', getMicroNutrienteByIdSchema, microNutrienteController.getParamId);
  fastify.post('/', postMicroNutrienteSchema, microNutrienteController.post);
  fastify.put('/:id', putMicroNutrienteByIdSchema, microNutrienteController.putParamId);
  fastify.delete('/:id', deleteMicroNutrienteByIdSchema, microNutrienteController.deleteParamId);
}
export default microNutrientesRoutes;