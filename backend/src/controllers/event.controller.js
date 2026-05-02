// src/controllers/event.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listEvents(req, res) {
  const { month, year } = req.query;
  let where = {};

  if (month && year) {
    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 0, 23, 59, 59);
    where.date = { gte: start, lte: end };
  }

  const events = await prisma.event.findMany({
    where,
    orderBy: { date: 'asc' },
  });

  return res.json(events);
}

async function getEvent(req, res) {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
  });
  if (!event) return res.status(404).json({ error: 'Evento não encontrado' });
  return res.json(event);
}

async function createEvent(req, res) {
  const { title, description, date, endDate, location, color } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: 'Título e data são obrigatórios' });
  }

  const event = await prisma.event.create({
    data: {
      title,
      description,
      date: new Date(date),
      endDate: endDate ? new Date(endDate) : null,
      location,
      color: color || '#4F46E5',
    },
  });

  return res.status(201).json(event);
}

async function updateEvent(req, res) {
  const { title, description, date, endDate, location, color } = req.body;

  const exists = await prisma.event.findUnique({ where: { id: req.params.id } });
  if (!exists) return res.status(404).json({ error: 'Evento não encontrado' });

  const event = await prisma.event.update({
    where: { id: req.params.id },
    data: {
      title,
      description,
      date: date ? new Date(date) : undefined,
      endDate: endDate ? new Date(endDate) : null,
      location,
      color,
    },
  });

  return res.json(event);
}

async function deleteEvent(req, res) {
  const exists = await prisma.event.findUnique({ where: { id: req.params.id } });
  if (!exists) return res.status(404).json({ error: 'Evento não encontrado' });

  await prisma.event.delete({ where: { id: req.params.id } });
  return res.json({ message: 'Evento removido com sucesso' });
}

module.exports = { listEvents, getEvent, createEvent, updateEvent, deleteEvent };
