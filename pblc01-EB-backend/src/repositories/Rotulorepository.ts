import { prisma } from '../../lib/prisma.js';
import type { Rotulo } from '../../generated/prisma/client.js';

export class RotuloRepository {
    public async findAll(): Promise<Rotulo[]> {
        return prisma.rotulo.findMany({ include: { fichaTecnica: true } });
    }

    public async findById(id: number): Promise<Rotulo | null> {
        return prisma.rotulo.findUnique({
            where: { idRotulo: id },
            include: { fichaTecnica: true },
        });
    }

    public async create(data: Omit<Rotulo, 'idRotulo'>): Promise<Rotulo> {
        return prisma.rotulo.create({ data });
    }

    public async update(id: number, data: Partial<Omit<Rotulo, 'idRotulo'>>): Promise<Rotulo> {
        return prisma.rotulo.update({ where: { idRotulo: id }, data });
    }

    public async delete(id: number): Promise<Rotulo> {
        return prisma.rotulo.delete({ where: { idRotulo: id } });
    }
}