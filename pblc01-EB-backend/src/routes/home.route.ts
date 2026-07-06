import type { FastifyInstance } from 'fastify';
import { homeController } from '../controllers/HomeController.js';
async function homeRoutes(fastify: FastifyInstance) {
 // Rota GET /
 fastify.get('/', homeController.get);
}
export default homeRoutes;