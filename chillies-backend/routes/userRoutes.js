const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isSuperuser } = require('../middleware/auth');

// Routes protégées nécessitant un token et le rôle superuser
router.get('/', verifyToken, isSuperuser, userController.getAllUsers);
router.get('/:id', verifyToken, isSuperuser, userController.getUserById);
router.post('/', verifyToken, isSuperuser, userController.createUser);
router.put('/:id', verifyToken, isSuperuser, userController.updateUser);
router.delete('/:id', verifyToken, isSuperuser, userController.deleteUser);

module.exports = router; 