import type { FastifyRequest, FastifyReply } from 'fastify';
import { ReceitaRepository } from '../repositories/Receitarepository.js';
import type { Receita } from '../../generated/prisma/client.js';

export class ReceitaController {
  private receitaRepository = new ReceitaRepository();

  get = async (request: FastifyRequest, reply: FastifyReply) => {
    const json = await this.receitaRepository.findAll();
    reply.status(200).send(json);
  };

  getParamId = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const json = await this.receitaRepository.findById(parseInt(id));
    if (json) {
      reply.status(200).send(json);
    } else {
      reply.status(404).send({ message: 'Receita não encontrada.' });
    }
  };

  post = async (
    request: FastifyRequest<{ Body: Omit<Receita, 'idReceita'> }>,
    reply: FastifyReply,
  ) => {
    const json = await this.receitaRepository.create(request.body);
    reply.status(201).send(json);
  };

  putParamId = async (
    request: FastifyRequest<{ Params: { id: string }; Body: Partial<Omit<Receita, 'idReceita'>> }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const { modoPreparo, tempoPreparo, rendimentoPorcoes } = request.body;
    try {
      const json = await this.receitaRepository.update(
        parseInt(id),
        { modoPreparo, tempoPreparo, rendimentoPorcoes } as Partial<Omit<Receita, 'idReceita'>>,
      );
      reply.status(200).send(json);
    } catch (error) {
      reply.status(404).send({ message: 'Receita não encontrada.' });
    }
  };

  deleteParamId = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    try {
      const json = await this.receitaRepository.delete(parseInt(id));
      reply.status(200).send(json);
    } catch (error) {
      reply.status(404).send({ message: 'Receita não encontrada.' });
    }
  };
}

export const receitaController = new ReceitaController();