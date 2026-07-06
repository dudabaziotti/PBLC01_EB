import { prisma } from '../../lib/prisma.js';
import type { Receita } from '../../generated/prisma/client.js';

export class ReceitaRepository {
    public async findAll(): Promise<Receita[]> {
        return prisma.receita.findMany({ include: { fichaTecnica: true } });
    }

    public async findById(id: number): Promise<Receita | null> {
        return prisma.receita.findUnique({
            where: { idReceita: id },
            include: { fichaTecnica: true },
        });
    }

    public async create(data: Omit<Receita, 'idReceita'>): Promise<Receita> {
        return prisma.receita.create({ data });
    }

    public async update(id: number, data: Partial<Omit<Receita, 'idReceita'>>): Promise<Receita> {
        return prisma.receita.update({ where: { idReceita: id }, data });
    }

    public async delete(id: number): Promise<Receita> {
        return prisma.receita.delete({ where: { idReceita: id } });
    }
}