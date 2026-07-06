import type { FastifyRequest, FastifyReply } from 'fastify';
import { RotuloRepository } from '../repositories/Rotulorepository.js';
import type { Rotulo } from '../../generated/prisma/client.js';

export class RotuloController {
  private rotuloRepository = new RotuloRepository();

  get = async (request: FastifyRequest, reply: FastifyReply) => {
    const json = await this.rotuloRepository.findAll();
    reply.status(200).send(json);
  };

  getParamId = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const json = await this.rotuloRepository.findById(parseInt(id));
    if (json) {
      reply.status(200).send(json);
    } else {
      reply.status(404).send({ message: 'Rótulo não encontrado.' });
    }
  };

  post = async (
    request: FastifyRequest<{ Body: Omit<Rotulo, 'idRotulo'> }>,
    reply: FastifyReply,
  ) => {
    const json = await this.rotuloRepository.create(request.body);
    reply.status(201).send(json);
  };

  putParamId = async (
    request: FastifyRequest<{ Params: { id: string }; Body: Partial<Omit<Rotulo, 'idRotulo'>> }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const { listaAlergenos, instrucoesConservacao, validadeDias, fichaTecnicaId } = request.body;
    try {
      const json = await this.rotuloRepository.update(
        parseInt(id),
        { listaAlergenos, instrucoesConservacao, validadeDias, fichaTecnicaId } as Partial<Omit<Rotulo, 'idRotulo'>>,
      );
      reply.status(200).send(json);
    } catch (error) {
      reply.status(404).send({ message: 'Rótulo não encontrado.' });
    }
  };

  deleteParamId = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    try {
      const json = await this.rotuloRepository.delete(parseInt(id));
      reply.status(200).send(json);
    } catch (error) {
      reply.status(404).send({ message: 'Rótulo não encontrado.' });
    }
  };
}

export const rotuloController = new RotuloController();