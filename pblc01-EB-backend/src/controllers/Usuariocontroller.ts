import type { FastifyRequest, FastifyReply } from 'fastify';
import { UsuarioRepository } from '../repositories/Usuariorepository.js';
import type { Usuario } from '../../generated/prisma/client.js';
import argon2 from 'argon2';

export class UsuarioController {
  private usuarioRepository = new UsuarioRepository();

  get = async (request: FastifyRequest, reply: FastifyReply) => {
    const json = await this.usuarioRepository.findAll();
    reply.status(200).send(json);
  };

  getParamId = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const json = await this.usuarioRepository.findById(parseInt(id));
    if (json) {
      reply.status(200).send(json);
    } else {
      reply.status(404).send({ message: 'Usuário não encontrado.' });
    }
  };

  post = async (
    request: FastifyRequest<{ Body: Omit<Usuario, 'idUsuario'> }>,
    reply: FastifyReply,
  ) => {
    const { senha, ...resto } = request.body;
    const senhaHash = await argon2.hash(senha);
    const json = await this.usuarioRepository.create({ ...resto, senha: senhaHash });
    reply.status(201).send(json);
  };

  putParamId = async (
    request: FastifyRequest<{ Params: { id: string }; Body: Partial<Omit<Usuario, 'idUsuario'>> }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const { nome, email, senha, tipo, cnpj, nomeEmpresa, telefoneContato, nivelPrivilegio } = request.body;
    try {
      const dadosAtualizados: Partial<Omit<Usuario, 'idUsuario'>> = {
        nome, email, tipo, cnpj, nomeEmpresa, telefoneContato, nivelPrivilegio,
      } as Partial<Omit<Usuario, 'idUsuario'>>;
      if (senha) {
        dadosAtualizados.senha = await argon2.hash(senha);
      }
      const json = await this.usuarioRepository.update(parseInt(id), dadosAtualizados);
      reply.status(200).send(json);
    } catch (error) {
      reply.status(404).send({ message: 'Usuário não encontrado.' });
    }
  };

  deleteParamId = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    try {
      const json = await this.usuarioRepository.delete(parseInt(id));
      reply.status(200).send(json);
    } catch (error) {
      reply.status(404).send({ message: 'Usuário não encontrado.' });
    }
  };
}

export const usuarioController = new UsuarioController();