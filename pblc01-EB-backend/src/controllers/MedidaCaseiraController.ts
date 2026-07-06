import type { FastifyRequest, FastifyReply } from 'fastify';
import { MedidaCaseiraRepository } from '../repositories/MedidaCaseiraRepository.js';
import type { MedidaCaseira } from '../../generated/prisma/client.js';

export class MedidaCaseiraController {
  private medidaCaseiraRepository = new MedidaCaseiraRepository();

  get = async (request: FastifyRequest, reply: FastifyReply) => {
    const json = await this.medidaCaseiraRepository.findAll();
    reply.status(200).send(json);
  };

  getParamId = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const json = await this.medidaCaseiraRepository.findById(parseInt(id));
    if (json) {
      reply.status(200).send(json);
    } else {
      reply.status(404).send({ message: 'Medida caseira não encontrada.' });
    }
  };

  post = async (
    request: FastifyRequest<{ Body: Omit<MedidaCaseira, 'id'> }>,
    reply: FastifyReply,
  ) => {
    const json = await this.medidaCaseiraRepository.create(request.body);
    reply.status(201).send(json);
  };

  putParamId = async (
    request: FastifyRequest<{ Params: { id: string }; Body: Partial<Omit<MedidaCaseira, 'id'>> }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const { descricao, gramagemEquivalente, valor, ingredienteId } = request.body;
    try {
      const json = await this.medidaCaseiraRepository.update(
        parseInt(id),
        { descricao, gramagemEquivalente, valor, ingredienteId } as Partial<Omit<MedidaCaseira, 'id'>>,
      );
      reply.status(200).send(json);
    } catch (error) {
      reply.status(404).send({ message: 'Medida caseira não encontrada.' });
    }
  };

  deleteParamId = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    try {
      const json = await this.medidaCaseiraRepository.delete(parseInt(id));
      reply.status(200).send(json);
    } catch (error) {
      reply.status(404).send({ message: 'Medida caseira não encontrada.' });
    }
  };
}

export const medidaCaseiraController = new MedidaCaseiraController();