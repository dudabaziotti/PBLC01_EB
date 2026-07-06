import type { FastifyRequest, FastifyReply } from 'fastify';
import { TabelaNutricionalRepository } from '../repositories/TabelaNutricionalRepository.js';
import type { TabelaNutricional } from '../../generated/prisma/client.js';

export class TabelaNutricionalController {
  private tabelaNutricionalRepository = new TabelaNutricionalRepository();

  get = async (request: FastifyRequest, reply: FastifyReply) => {
    const json = await this.tabelaNutricionalRepository.findAll();
    reply.status(200).send(json);
  };

  getParamId = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const json = await this.tabelaNutricionalRepository.findById(parseInt(id));
    if (json) {
      reply.status(200).send(json);
    } else {
      reply.status(404).send({ message: 'Tabela nutricional não encontrada.' });
    }
  };

  post = async (
    request: FastifyRequest<{ Body: Omit<TabelaNutricional, 'idTabela'> }>,
    reply: FastifyReply,
  ) => {
    const json = await this.tabelaNutricionalRepository.create(request.body);
    reply.status(201).send(json);
  };

  putParamId = async (
    request: FastifyRequest<{ Params: { id: string }; Body: Partial<Omit<TabelaNutricional, 'idTabela'>> }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const { dados, formato, medidaCaseiraId, fichaTecnicaId } = request.body;
    try {
      const json = await this.tabelaNutricionalRepository.update(
        parseInt(id),
        { dados, formato, medidaCaseiraId, fichaTecnicaId } as Partial<Omit<TabelaNutricional, 'idTabela'>>,
      );
      reply.status(200).send(json);
    } catch (error) {
      reply.status(404).send({ message: 'Tabela nutricional não encontrada.' });
    }
  };

  deleteParamId = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    try {
      const json = await this.tabelaNutricionalRepository.delete(parseInt(id));
      reply.status(200).send(json);
    } catch (error) {
      reply.status(404).send({ message: 'Tabela nutricional não encontrada.' });
    }
  };
}

export const tabelaNutricionalController = new TabelaNutricionalController();