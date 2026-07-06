import type { FastifyInstance } from 'fastify';
import { usuarioController } from '../controllers/Usuariocontroller.js';
import {
  deleteUsuarioByIdSchema,
  getUsuarioByIdSchema,
  getUsuarioSchema,
  postUsuarioSchema,
  putUsuarioByIdSchema,
} from '../schemas/Usuario.schema.js';

async function usuariosRoutes(fastify: FastifyInstance) {
  fastify.get('/', getUsuarioSchema, usuarioController.get);
  fastify.get('/:id', getUsuarioByIdSchema, usuarioController.getParamId);
  fastify.post('/', postUsuarioSchema, usuarioController.post);
  fastify.put('/:id', putUsuarioByIdSchema, usuarioController.putParamId);
  fastify.delete('/:id', deleteUsuarioByIdSchema, usuarioController.deleteParamId);
}
export default usuariosRoutes;