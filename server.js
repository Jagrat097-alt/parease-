require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const parkingRoutes = require('./routes/parking');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins for now (update for production)
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
let MongoMemoryServer;
try {
    ({ MongoMemoryServer } = require('mongodb-memory-server'));
} catch (e) {
    console.error('\n\n❌ ERROR: "mongodb-memory-server" is missing.');
    console.error('👉 Please run: npm install\n\n');
    process.exit(1);
}

async function connectDB() {
    try {
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();

        console.log('Starting In-Memory MongoDB...');

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB Connected (In-Memory) at ${uri}`);
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
    }
}

connectDB();

// Make io accessible in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/parking', parkingRoutes);

// Socket.io Connection
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
