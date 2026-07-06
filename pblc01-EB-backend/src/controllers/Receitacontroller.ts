import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../lib/prisma.js';
import type { Prisma } from '../../generated/prisma/client.js';

interface ReceitaBodyInput {
  nome: string;
  modoPreparo: string;
  tempoPreparo: number;
  rendimentoPorcoes: number;
  ingredientes: {
    ingredienteId: number;
    quantidade: number;
  }[];
}

export class ReceitaController {
  get = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const receitas = await prisma.receita.findMany({
        include: {
          ingredientes: true,
        },
      });

      const formatadas = receitas.map((receita) => ({
        idReceita: receita.idReceita,
        nome: receita.nome,
        modoPreparo: receita.modoPreparo,
        tempoPreparo: receita.tempoPreparo,
        rendimentoPorcoes: receita.rendimentoPorcoes,
        ingredientes: receita.ingredientes.map((ri) => ({
          ingredienteId: ri.idIngrediente,
          quantidade: ri.quantidade,
        })),
      }));

      reply.status(200).send(formatadas);
    } catch (error) {
      reply.status(500).send({ message: 'Erro ao listar receitas.' });
    }
  };

  getParamId = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    try {
      const receita = await prisma.receita.findUnique({
        where: { idReceita: parseInt(id) },
        include: {
          ingredientes: true,
        },
      });

      if (receita) {
        const formatada = {
          idReceita: receita.idReceita,
          nome: receita.nome,
          modoPreparo: receita.modoPreparo,
          tempoPreparo: receita.tempoPreparo,
          rendimentoPorcoes: receita.rendimentoPorcoes,
          ingredientes: receita.ingredientes.map((ri) => ({
            ingredienteId: ri.idIngrediente,
            quantidade: ri.quantidade,
          })),
        };
        reply.status(200).send(formatada);
      } else {
        reply.status(404).send({ message: 'Receita não encontrada.' });
      }
    } catch (error) {
      reply.status(500).send({ message: 'Erro ao buscar receita.' });
    }
  };

  post = async (
    request: FastifyRequest<{ Body: ReceitaBodyInput }>,
    reply: FastifyReply,
  ) => {
    try {
      const { nome, modoPreparo, tempoPreparo, rendimentoPorcoes, ingredientes } = request.body;

      const novaReceita = await prisma.receita.create({
        data: {
          nome,
          modoPreparo,
          tempoPreparo: Number(tempoPreparo),
          rendimentoPorcoes: Number(rendimentoPorcoes),
          ingredientes: {
            create: ingredientes.map((item) => ({
              idIngrediente: item.ingredienteId,
              quantidade: item.quantidade,
            })),
          },
        },
      });

      reply.status(201).send(novaReceita);
    } catch (error) {
      reply.status(500).send({ message: 'Erro ao criar receita.' });
    }
  };

  putParamId = async (
    request: FastifyRequest<{ Params: { id: string }; Body: ReceitaBodyInput }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const { nome, modoPreparo, tempoPreparo, rendimentoPorcoes, ingredientes } = request.body;

    try {
      const json = await prisma.$transaction(async (tx) => {
        await tx.receitaIngrediente.deleteMany({
          where: { idReceita: parseInt(id) },
        });

        return await tx.receita.update({
          where: { idReceita: parseInt(id) },
          data: {
            nome,
            modoPreparo,
            tempoPreparo: Number(tempoPreparo),
            rendimentoPorcoes: Number(rendimentoPorcoes),
            ingredientes: {
              create: ingredientes.map((item) => ({
                idIngrediente: item.ingredienteId,
                quantidade: item.quantidade,
              })),
            },
          },
        });
      });

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
      const json = await prisma.receita.delete({
        where: { idReceita: parseInt(id) },
      });
      reply.status(200).send(json);
    } catch (error) {
      reply.status(404).send({ message: 'Receita não encontrada.' });
    }
  };
}

export const receitaController = new ReceitaController();