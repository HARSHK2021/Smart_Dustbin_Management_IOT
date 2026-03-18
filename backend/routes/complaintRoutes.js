const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus
} = require('../controllers/complaintController');

module.exports = (io) => {
  router.post('/', (req, res) => createComplaint(req, res, io));
  router.get('/', getAllComplaints);
  router.patch('/:id', (req, res) => updateComplaintStatus(req, res, io));

  return router;
};
