import { prisma } from '../../lib/prisma.js';
import type { TabelaNutricional } from '../../generated/prisma/client.js';

export class TabelaNutricionalRepository {
  public async findAll(): Promise<TabelaNutricional[]> {
    return prisma.tabelaNutricional.findMany({
      include: { medidaCaseira: true, micronutrientes: true, ingredientes: true, fichaTecnica: true },
    });
  }
  public async findById(id: number): Promise<TabelaNutricional | null> {
    return prisma.tabelaNutricional.findUnique({
      where: { idTabela: id },
      include: { medidaCaseira: true, micronutrientes: true, ingredientes: true, fichaTecnica: true },
    });
  }
  public async create(data: Omit<TabelaNutricional, 'idTabela'>): Promise<TabelaNutricional> {
    return prisma.tabelaNutricional.create({ data });
  }
  public async update(id: number, data: Partial<Omit<TabelaNutricional, 'idTabela'>>): Promise<TabelaNutricional> {
    return prisma.tabelaNutricional.update({ where: { idTabela: id }, data });
  }
  public async delete(id: number): Promise<TabelaNutricional> {
    return prisma.tabelaNutricional.delete({ where: { idTabela: id } });
  }
}