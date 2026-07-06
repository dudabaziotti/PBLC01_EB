import type { FastifyRequest, FastifyReply } from 'fastify';
import { FichaTecnicaRepository } from '../repositories/Fichatecnicarepository.js';
import type { FichaTecnica } from '../../generated/prisma/client.js';

export class FichaTecnicaController {
    // use funções de seta para manter contexto do atributo
    private fichaTecnicaRepository = new FichaTecnicaRepository();

    // GET /fichas
    get = async (request: FastifyRequest, reply: FastifyReply) => {
        const json = await this.fichaTecnicaRepository.findAll();
        reply.status(200).send(json);
    };

    // GET /fichas/:id
    getParamId = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply,
    ) => {
        const { id } = request.params;
        const json = await this.fichaTecnicaRepository.findById(id);
        if (json) {
            reply.status(200).send(json);
        } else {
            reply.status(404).send({ message: 'Ficha técnica não encontrada.' });
        }
    };

    // POST /fichas
    post = async (
        request: FastifyRequest<{ Body: FichaTecnica }>,
        reply: FastifyReply,
    ) => {
        const ficha = request.body;
        const json = await this.fichaTecnicaRepository.create(ficha);
        reply.status(201).send(json);
    };

    // PUT /fichas/:id
    putParamId = async (
        request: FastifyRequest<{
            Params: { id: string };
            Body: Partial<Omit<FichaTecnica, 'idFicha'>>;
        }>,
        reply: FastifyReply,
    ) => {
        const { id } = request.params;
        const { nomeReceita, autor, pesoTotal, tamanhoPorcao, formatos, receitaId, usuarioId } =
            request.body;

        try {
            const json = await this.fichaTecnicaRepository.update(id, {
                nomeReceita,
                autor,
                pesoTotal,
                tamanhoPorcao,
                formatos,
                receitaId,
                usuarioId,
            }as any );
            reply.status(200).send(json);
        } catch (error) {
            reply.status(404).send({ message: 'Ficha técnica não encontrada.' });
        }
    };

    // DELETE /fichas/:id
    deleteParamId = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply,
    ) => {
        const { id } = request.params;
        try {
            const json = await this.fichaTecnicaRepository.delete(id);
            reply.status(200).send(json);
        } catch (error) {
            reply.status(404).send({ message: 'Ficha técnica não encontrada.' });
        }
    };

    // POST /fichas/:id/ingredientes/:ingredienteId
    postIngredienteParamId = async (
        request: FastifyRequest<{ Params: { id: string; ingredienteId: string } }>,
        reply: FastifyReply,
    ) => {
        const { id, ingredienteId } = request.params;
        await this.fichaTecnicaRepository.addIngrediente(id, parseInt(ingredienteId));
        reply.status(201).send({ message: 'Ingrediente adicionado à ficha técnica.' });
    };
}

// Exporta a instância do controller
export const fichaTecnicaController = new FichaTecnicaController();