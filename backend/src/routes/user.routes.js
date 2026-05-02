// src/routes/user.routes.js
const { Router } = require('express');
const { authenticate, authorizeAdmin } = require('../middlewares/auth.middleware');
const { listUsers, createUser, deleteUser } = require('../controllers/user.controller');

const router = Router();

// Todas as rotas de usuário são exclusivas do admin
router.use(authenticate, authorizeAdmin);

router.get('/', listUsers);
router.post('/', createUser);
router.delete('/:id', deleteUser);

module.exports = router;
