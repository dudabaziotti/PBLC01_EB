import type { FastifyRequest, FastifyReply } from 'fastify';
import { IngredienteRepository } from '../repositories/Ingredienterepository.js';
import type { Ingrediente } from '../../generated/prisma/client.js';

export class IngredienteController {
    // use funções de seta para manter contexto do atributo
    private ingredienteRepository = new IngredienteRepository();

    // GET /ingredientes
    get = async (request: FastifyRequest, reply: FastifyReply) => {
        const json = await this.ingredienteRepository.findAll();
        reply.status(200).send(json);
    };

    // GET /ingredientes/:id
    getParamId = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply,
    ) => {
        const { id } = request.params;
        const json = await this.ingredienteRepository.findById(parseInt(id));
        if (json) {
            reply.status(200).send(json);
        } else {
            reply.status(404).send({ message: 'Ingrediente não encontrado.' });
        }
    };

    // POST /ingredientes
    post = async (
        request: FastifyRequest<{ Body: Omit<Ingrediente, 'idIngrediente' | 'dataCadastro'> }>,
        reply: FastifyReply,
    ) => {
        const ingrediente = request.body;
        const json = await this.ingredienteRepository.create(ingrediente);
        reply.status(201).send(json);
    };

    // PUT /ingredientes/:id
    putParamId = async (
        request: FastifyRequest<{
            Params: { id: string };
            Body: Partial<Omit<Ingrediente, 'idIngrediente' | 'dataCadastro'>>;
        }>,
        reply: FastifyReply,
    ) => {
        const { id } = request.params;
        const { nome, unidade, fonte, fonteReferenciaId } = request.body;

        try {
            const json = await this.ingredienteRepository.update(parseInt(id), {
                nome,
                unidade,
                fonte,
                fonteReferenciaId,
            }as any );
            reply.status(200).send(json);
        } catch (error) {
            reply.status(404).send({ message: 'Ingrediente não encontrado.' });
        }
    };

    // DELETE /ingredientes/:id
    deleteParamId = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply,
    ) => {
        const { id } = request.params;
        try {
            const json = await this.ingredienteRepository.delete(parseInt(id));
            reply.status(200).send(json);
        } catch (error) {
            reply.status(404).send({ message: 'Ingrediente não encontrado.' });
        }
    };
}

// Exporta a instância do controller
export const ingredienteController = new IngredienteController();