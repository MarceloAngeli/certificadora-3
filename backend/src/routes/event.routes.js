// src/routes/event.routes.js
const { Router } = require('express');
const { authenticate, authorizeAdmin } = require('../middlewares/auth.middleware');
const {
  listEvents, getEvent, createEvent, updateEvent, deleteEvent,
} = require('../controllers/event.controller');

const router = Router();

// Rotas públicas (qualquer um autenticado pode ver)
router.get('/', listEvents);
router.get('/:id', getEvent);

// Rotas admin (apenas administradores)
router.post('/', authenticate, authorizeAdmin, createEvent);
router.put('/:id', authenticate, authorizeAdmin, updateEvent);
router.delete('/:id', authenticate, authorizeAdmin, deleteEvent);

module.exports = router;
