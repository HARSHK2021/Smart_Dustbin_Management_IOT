const Complaint = require('../models/Complaint');

const createComplaint = async (req, res, io) => {
  try {
    const { dustbinId, issue, description } = req.body;

    if (!dustbinId || !issue || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const complaintId = `CMP${Date.now()}`;

    const complaint = new Complaint({
      complaintId,
      dustbinId,
      issue,
      description,
      status: 'Pending'
    });

    await complaint.save();

    io.emit('newComplaint', complaint);

    res.json({ success: true, complaint });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ timestamp: -1 });
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateComplaintStatus = async (req, res, io) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const complaint = await Complaint.findOneAndUpdate(
      { complaintId: id },
      { status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    io.emit('complaintUpdate', complaint);

    res.json({ success: true, complaint });
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus
};
