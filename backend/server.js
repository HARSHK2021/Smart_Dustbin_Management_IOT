const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.enable('trust proxy');
mongoose.connect(process.env.MONGODB_URI, {
 
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

const dustbinRoutes = require('./routes/dustbinRoutes')(io);
const complaintRoutes = require('./routes/complaintRoutes')(io);
const messageRoutes = require('./routes/messageRoutes');

app.use('/api/dustbins', dustbinRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.status(200).send('Hello welcome to smart dustbin management backend');
});

app.get('/update', (req, res) => {
  
  const dustbinController = require('./controllers/dustbinController');
  dustbinController.updateDustbin(req, res, io);
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
