import type { FastifyInstance } from 'fastify';
import { fichaTecnicaController } from '../controllers/Fichatecnicacontroller.js';
import {
  deleteFichaTecnicaByIdSchema,
  getFichaTecnicaByIdSchema,
  getFichaTecnicaSchema,
  postFichaTecnicaIngredienteSchema,
  postFichaTecnicaSchema,
  putFichaTecnicaByIdSchema,
} from '../schemas/Fichatecnica.schema.js';

async function fichasTecnicasRoutes(fastify: FastifyInstance) {
  fastify.get('/', getFichaTecnicaSchema, fichaTecnicaController.get);
  fastify.get('/:id', getFichaTecnicaByIdSchema, fichaTecnicaController.getParamId);
  fastify.post('/', postFichaTecnicaSchema, fichaTecnicaController.post);
  fastify.put('/:id', putFichaTecnicaByIdSchema, fichaTecnicaController.putParamId);
  fastify.delete('/:id', deleteFichaTecnicaByIdSchema, fichaTecnicaController.deleteParamId);
  fastify.post('/:id/ingredientes/:ingredienteId', postFichaTecnicaIngredienteSchema, fichaTecnicaController.postIngredienteParamId);
}
export default fichasTecnicasRoutes;