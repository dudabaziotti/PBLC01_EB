import { prisma } from '../../lib/prisma.js';
import type { Ingrediente } from '../../generated/prisma/client.js';

export class IngredienteRepository {
    public async findAll(): Promise<Ingrediente[]> {
        return prisma.ingrediente.findMany({
            include: {
                fonteReferencia: true,
                microNutrientes: true,
                medidasCaseiras: true,
            },
        });
    }

    public async findById(id: number): Promise<Ingrediente | null> {
        return prisma.ingrediente.findUnique({
            where: { idIngrediente: id },
            include: {
                fonteReferencia: true,
                microNutrientes: true,
                medidasCaseiras: true,
            },
        });
    }

    public async create(data: Omit<Ingrediente, 'idIngrediente' | 'dataCadastro'>): Promise<Ingrediente> {
        return prisma.ingrediente.create({ data });
    }

    public async update(
        id: number,
        data: Partial<Omit<Ingrediente, 'idIngrediente' | 'dataCadastro'>>,
    ): Promise<Ingrediente> {
        return prisma.ingrediente.update({ where: { idIngrediente: id }, data });
    }

    public async delete(id: number): Promise<Ingrediente> {
        return prisma.ingrediente.delete({ where: { idIngrediente: id } });
    }
}