import type { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import * as authRepository from "../repositories/auth.repository.js";

export const loginController = async (
  request: FastifyRequest<{ Body: { email: string; senha: string } }>,
  reply: FastifyReply,
): Promise<void> => {
  const { email, senha } = request.body;
  if (!email || !senha) {
    reply.status(400).send({ message: "Email e senha são obrigatórios." });
    return;
  }
  const usuario = await authRepository.findUsuarioByEmail(email);
  if (!usuario) {
    reply.status(401).send({ message: "Usuário não encontrado." });
    return;
  }
  const senhaValida = await argon2.verify(usuario.senha, senha);
  if (!senhaValida) {
    reply.status(401).send({ message: "Senha inválida." });
    return;
  }
  const token = jwt.sign(
    { email: usuario.email, tipo: usuario.tipo },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1h" },
  );
  reply.status(200).send({ message: "Login realizado com sucesso!", token });
};
