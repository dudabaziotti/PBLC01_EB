import type { FastifyRequest, FastifyReply } from 'fastify';
import { FonteReferenciaRepository } from '../repositories/FonteReferenciaRepository.js';
import type { FonteReferencia } from '../../generated/prisma/client.js';

export class FonteReferenciaController {
  private fonteReferenciaRepository = new FonteReferenciaRepository();

  get = async (request: FastifyRequest, reply: FastifyReply) => {
    const json = await this.fonteReferenciaRepository.findAll();
    reply.status(200).send(json);
  };

  getParamId = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const json = await this.fonteReferenciaRepository.findById(parseInt(id));
    if (json) {
      reply.status(200).send(json);
    } else {
      reply.status(404).send({ message: 'Fonte de referência não encontrada.' });
    }
  };

  post = async (
    request: FastifyRequest<{ Body: Omit<FonteReferencia, 'id'> }>,
    reply: FastifyReply,
  ) => {
    const json = await this.fonteReferenciaRepository.create(request.body);
    reply.status(201).send(json);
  };

  putParamId = async (
    request: FastifyRequest<{ Params: { id: string }; Body: Partial<Omit<FonteReferencia, 'id'>> }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const { linkFonte, nomeFonte, anoPublicacao } = request.body;
    try {
      const json = await this.fonteReferenciaRepository.update(
        parseInt(id),
        { linkFonte, nomeFonte, anoPublicacao } as Partial<Omit<FonteReferencia, 'id'>>,
      );
      reply.status(200).send(json);
    } catch (error) {
      reply.status(404).send({ message: 'Fonte de referência não encontrada.' });
    }
  };

  deleteParamId = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    try {
      const json = await this.fonteReferenciaRepository.delete(parseInt(id));
      reply.status(200).send(json);
    } catch (error) {
      reply.status(404).send({ message: 'Fonte de referência não encontrada.' });
    }
  };
}

export const fonteReferenciaController = new FonteReferenciaController();