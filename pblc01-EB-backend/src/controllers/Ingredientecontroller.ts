import type { FastifyRequest, FastifyReply } from 'fastify';
import { IngredienteRepository } from '../repositories/Ingredienterepository.js';
import type { Ingrediente } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';

interface IngredienteBodyInput {
  nome: string;
  quantidade: number;
  unidade: string;
  fonte: string;
  fonteReferenciaId: number;
  micronutrientes: {
    nome: string;
    valor: number;
    unidade: string;
  }[];
}

export class IngredienteController {
    // use funções de seta para manter contexto do atributo
    private ingredienteRepository = new IngredienteRepository();

    // GET /ingredientes
    get = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const ingredientes = await prisma.ingrediente.findMany({
            include: {
                microNutrientes: true, // 🌟 Força o Prisma a trazer os micronutrientes vinculados
            },
            });
            reply.status(200).send(ingredientes);
        } catch (error) {
            reply.status(500).send({ message: 'Erro ao listar ingredientes.' });
        }
        };

    // GET /ingredientes/:id
    getParamId = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
    ) => {
    const { id } = request.params;
    try {
        const ingrediente = await prisma.ingrediente.findUnique({
        where: { idIngrediente: parseInt(id) },
        include: {
            microNutrientes: true,
        },
        });

        if (ingrediente) {
        reply.status(200).send(ingrediente);
        } else {
        reply.status(404).send({ message: 'Ingrediente não encontrado.' });
        }
    } catch (error) {
        reply.status(500).send({ message: 'Erro ao buscar ingrediente.' });
    }
    };

    // POST /ingredientes
    post = async (
    request: FastifyRequest<{ Body: IngredienteBodyInput }>,
    reply: FastifyReply,
    ) => {
    try {
        const { nome, quantidade, unidade, fonte, fonteReferenciaId, micronutrientes } = request.body;

        const novoIngrediente = await prisma.ingrediente.create({
        data: {
            nome,
            quantidade: Number(quantidade),
            unidade,
            fonte,
            fonteReferenciaId: Number(fonteReferenciaId),
            microNutrientes: {
            create: micronutrientes.map((m) => ({
                nome: m.nome,
                valor: Number(m.valor),
                unidade: m.unidade,
            })),
            },
        },
        });

            reply.status(201).send(novoIngrediente);
        } catch (error) {
            reply.status(500).send({ message: 'Erro ao criar ingrediente.' });
        }
        };

    // PUT /ingredientes/:id
    putParamId = async (
    request: FastifyRequest<{ Params: { id: string }; Body: IngredienteBodyInput }>,
    reply: FastifyReply,
    ) => {
    const { id } = request.params;
    const { nome, quantidade, unidade, fonte, fonteReferenciaId, micronutrientes } = request.body;

    try {
        const json = await prisma.$transaction(async (tx: any) => {
        await tx.microNutriente.deleteMany({
            where: { ingredienteId: parseInt(id) },
        });
        return await tx.ingrediente.update({
            where: { idIngrediente: parseInt(id) },
            data: {
            nome,
            quantidade: Number(quantidade),
            unidade,
            fonte,
            fonteReferenciaId: Number(fonteReferenciaId),
            microNutrientes: {
                create: micronutrientes.map((m) => ({
                nome: m.nome,
                valor: Number(m.valor),
                unidade: m.unidade,
                })),
            },
            },
        });
        });

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