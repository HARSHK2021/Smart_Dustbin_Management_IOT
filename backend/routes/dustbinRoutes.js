const express = require('express');
const router = express.Router();
const {
  updateDustbin,
  getAllDustbins,
  addDustbin,
  deleteDustbin
} = require('../controllers/dustbinController');

module.exports = (io) => {
  router.get('/update', (req, res) => updateDustbin(req, res, io));
  router.get('/', getAllDustbins);
  router.post('/', (req, res) => addDustbin(req, res, io));
  router.delete('/:id', (req, res) => deleteDustbin(req, res, io));

  return router;
};
