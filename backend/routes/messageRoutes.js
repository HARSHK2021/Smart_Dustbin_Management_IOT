const express = require('express');
const router = express.Router();
const { getAllMessages, deleteMessage } = require('../controllers/messageController');

router.get('/', getAllMessages);
router.delete('/:messageId', deleteMessage);

module.exports = router;
