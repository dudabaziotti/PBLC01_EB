import type { FastifyRequest, FastifyReply } from 'fastify';
import { MicroNutrienteRepository } from '../repositories/MicroNutrienteRepository.js';
import type { MicroNutriente } from '../../generated/prisma/client.js';

export class MicroNutrienteController {
  private microNutrienteRepository = new MicroNutrienteRepository();

  get = async (request: FastifyRequest, reply: FastifyReply) => {
    const json = await this.microNutrienteRepository.findAll();
    reply.status(200).send(json);
  };

  getParamId = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const json = await this.microNutrienteRepository.findById(parseInt(id));
    if (json) {
      reply.status(200).send(json);
    } else {
      reply.status(404).send({ message: 'Micronutriente não encontrado.' });
    }
  };

  post = async (
    request: FastifyRequest<{ Body: Omit<MicroNutriente, 'id'> }>,
    reply: FastifyReply,
  ) => {
    const json = await this.microNutrienteRepository.create(request.body);
    reply.status(201).send(json);
  };

  putParamId = async (
    request: FastifyRequest<{ Params: { id: string }; Body: Partial<Omit<MicroNutriente, 'id'>> }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const { nome, valor, unidade, ingredienteId, tabelaId } = request.body;
    try {
      const json = await this.microNutrienteRepository.update(
        parseInt(id),
        { nome, valor, unidade, ingredienteId, tabelaId } as Partial<Omit<MicroNutriente, 'id'>>,
      );
      reply.status(200).send(json);
    } catch (error) {
      reply.status(404).send({ message: 'Micronutriente não encontrado.' });
    }
  };

  deleteParamId = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    try {
      const json = await this.microNutrienteRepository.delete(parseInt(id));
      reply.status(200).send(json);
    } catch (error) {
      reply.status(404).send({ message: 'Micronutriente não encontrado.' });
    }
  };
}

export const microNutrienteController = new MicroNutrienteController();