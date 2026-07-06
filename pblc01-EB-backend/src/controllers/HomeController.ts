import type { FastifyRequest, FastifyReply } from 'fastify';
export class HomeController {
 //use funções de seta para manter contexto do atributo
 public static numero = 0;
 //método assíncrono para a requisição GET /
 get = async (request: FastifyRequest, reply: FastifyReply) => {
 HomeController.numero++;
 return reply.status(201).send({
 api: 'Home API',
 contador: HomeController.numero });
 };
}
// Exporta a instância do controller
export const homeController = new HomeController();