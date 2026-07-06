import { prisma } from '../../lib/prisma.js';
import type { MicroNutriente } from '../../generated/prisma/client.js';

export class MicroNutrienteRepository {
  public async findAll(): Promise<MicroNutriente[]> {
    return prisma.microNutriente.findMany({ include: { ingrediente: true, tabela: true } });
  }
  public async findById(id: number): Promise<MicroNutriente | null> {
    return prisma.microNutriente.findUnique({ where: { id }, include: { ingrediente: true, tabela: true } });
  }
  public async create(data: Omit<MicroNutriente, 'id'>): Promise<MicroNutriente> {
    return prisma.microNutriente.create({ data });
  }
  public async update(id: number, data: Partial<Omit<MicroNutriente, 'id'>>): Promise<MicroNutriente> {
    return prisma.microNutriente.update({ where: { id }, data });
  }
  public async delete(id: number): Promise<MicroNutriente> {
    return prisma.microNutriente.delete({ where: { id } });
  }
}