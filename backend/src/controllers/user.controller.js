// src/controllers/user.controller.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function listUsers(req, res) {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  return res.json(users);
}

async function createUser(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return res.status(409).json({ error: 'Email já cadastrado' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: role || 'USER' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return res.status(201).json(user);
}

async function deleteUser(req, res) {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  // Não deixar deletar o próprio admin logado
  if (req.user.id === req.params.id) {
    return res.status(400).json({ error: 'Você não pode se auto-deletar' });
  }

  await prisma.user.delete({ where: { id: req.params.id } });
  return res.json({ message: 'Usuário removido com sucesso' });
}

module.exports = { listUsers, createUser, deleteUser };
