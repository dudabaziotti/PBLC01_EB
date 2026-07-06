import { prisma } from '../../lib/prisma.js';

export const findUsuarioByEmail = async (email: string) => {
  return prisma.usuario.findUnique({ where: { email } });
};