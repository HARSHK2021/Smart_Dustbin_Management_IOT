const Dustbin = require('../models/Dustbin');
const Message = require('../models/Message');

const updateDustbin = async (req, res, io) => {
  try {
    
    const { id, level, status, lat, lng } = req.query;
    console.log(id, level, status, lat, lng);
    console.log("Incoming request:", req.query);

    if (!id || level === undefined || !status || !lat || !lng) {
      return res.status(400).json({ error: 'Missing required parameters' });
    } 

    const levelNum = parseFloat(level);
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(levelNum) || isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'Invalid numeric values' });
    }

    const dustbinData = {
      id,
      level: levelNum,
      status: status.toUpperCase(),
      latitude,
      longitude,
      lastUpdated: new Date()
    };

    let dustbin = await Dustbin.findOneAndUpdate(
      { id },
      dustbinData,
      { new: true, upsert: true }
    );

    if (status.toUpperCase() === 'FULL') {
      const messageId = `MSG${Date.now()}`;
      const message = new Message({
        messageId,
        text: `Dustbin ${id} is FULL and needs immediate attention!`,
        type: 'ALERT',
        dustbinId: id
      });
      await message.save();

      io.emit('newMessage', message);
    }

    io.emit('dustbinUpdate', dustbin);

    res.set('Connection', 'close');
res.set('Content-Type', 'application/json');
res.status(200).send(JSON.stringify({ success: true }));
  } catch (error) {
    console.error('Error updating dustbin:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllDustbins = async (req, res) => {
  try {
    const dustbins = await Dustbin.find().sort({ lastUpdated: -1 });
    res.json(dustbins);
  } catch (error) {
    console.error('Error fetching dustbins:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const addDustbin = async (req, res, io) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const randomId = `DB${Math.floor(1000 + Math.random() * 9000)}`;

    const dustbin = new Dustbin({
      id: randomId,
      level: 0,
      status: 'EMPTY',
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    });

    await dustbin.save();

    io.emit('dustbinAdded', dustbin);

    res.json({ success: true, dustbin });
  } catch (error) {
    console.error('Error adding dustbin:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteDustbin = async (req, res, io) => {
  try {
    const { id } = req.params;

    const dustbin = await Dustbin.findOneAndDelete({ id });

    if (!dustbin) {
      return res.status(404).json({ error: 'Dustbin not found' });
    }

    io.emit('dustbinDeleted', id);

    res.json({ success: true, message: 'Dustbin deleted' });
  } catch (error) {
    console.error('Error deleting dustbin:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  updateDustbin,
  getAllDustbins,
  addDustbin,
  deleteDustbin
};
