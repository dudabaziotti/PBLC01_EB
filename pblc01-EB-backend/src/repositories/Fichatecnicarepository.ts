import { prisma } from '../../lib/prisma.js';
import type { FichaTecnica } from '../../generated/prisma/client.js';

export class FichaTecnicaRepository {
    public async findAll(): Promise<FichaTecnica[]> {
        return prisma.fichaTecnica.findMany({
            include: {
                receita: true,
                tabelas: true,
                rotulos: true,
                ingredientes: { include: { ingrediente: true } },
            },
        });
    }

    public async findById(id: string): Promise<FichaTecnica | null> {
        return prisma.fichaTecnica.findUnique({
            where: { idFicha: id },
            include: {
                receita: true,
                tabelas: true,
                rotulos: true,
                ingredientes: { include: { ingrediente: true } },
            },
        });
    }

    public async create(data: Omit<FichaTecnica, 'formatos'> & { formatos?: string[] }): Promise<FichaTecnica> {
        return prisma.fichaTecnica.create({ data });
    }

    public async update(
        id: string,
        data: Partial<Omit<FichaTecnica, 'idFicha'>>,
    ): Promise<FichaTecnica> {
        return prisma.fichaTecnica.update({ where: { idFicha: id }, data });
    }

    public async delete(id: string): Promise<FichaTecnica> {
        return prisma.fichaTecnica.delete({ where: { idFicha: id } });
    }

    public async addIngrediente(fichaId: string, ingredienteId: number): Promise<void> {
        await prisma.fichaTecnicaIngrediente.create({
            data: { fichaId, ingredienteId },
        });
    }
}