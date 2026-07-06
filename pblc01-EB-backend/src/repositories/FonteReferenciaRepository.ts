import { prisma } from '../../lib/prisma.js';
import type { FonteReferencia } from '../../generated/prisma/client.js';

export class FonteReferenciaRepository {
  public async findAll(): Promise<FonteReferencia[]> {
    return prisma.fonteReferencia.findMany({ include: { ingredientes: true } });
  }
  public async findById(id: number): Promise<FonteReferencia | null> {
    return prisma.fonteReferencia.findUnique({ where: { id }, include: { ingredientes: true } });
  }
  public async create(data: Omit<FonteReferencia, 'id'>): Promise<FonteReferencia> {
    return prisma.fonteReferencia.create({ data });
  }
  public async update(id: number, data: Partial<Omit<FonteReferencia, 'id'>>): Promise<FonteReferencia> {
    return prisma.fonteReferencia.update({ where: { id }, data });
  }
  public async delete(id: number): Promise<FonteReferencia> {
    return prisma.fonteReferencia.delete({ where: { id } });
  }
}