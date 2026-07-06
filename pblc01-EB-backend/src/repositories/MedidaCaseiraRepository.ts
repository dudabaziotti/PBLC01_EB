import { prisma } from '../../lib/prisma.js';
import type { MedidaCaseira } from '../../generated/prisma/client.js';

export class MedidaCaseiraRepository {
  public async findAll(): Promise<MedidaCaseira[]> {
    return prisma.medidaCaseira.findMany({ include: { ingrediente: true, tabelaNutricional: true } });
  }
  public async findById(id: number): Promise<MedidaCaseira | null> {
    return prisma.medidaCaseira.findUnique({ where: { id }, include: { ingrediente: true, tabelaNutricional: true } });
  }
  public async create(data: Omit<MedidaCaseira, 'id'>): Promise<MedidaCaseira> {
    return prisma.medidaCaseira.create({ data });
  }
  public async update(id: number, data: Partial<Omit<MedidaCaseira, 'id'>>): Promise<MedidaCaseira> {
    return prisma.medidaCaseira.update({ where: { id }, data });
  }
  public async delete(id: number): Promise<MedidaCaseira> {
    return prisma.medidaCaseira.delete({ where: { id } });
  }
}