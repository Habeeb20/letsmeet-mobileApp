// import express from 'express';
// import authRoutes from './routes/userRoutes.js';
// import connectDB from './config/db.js';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import morgan from 'morgan';
// import datingRouter from './routes/datingRoute.js';
// import postRouter from "./routes/postRoute.js";
// import setupSocket from './config/socketioSetup.js';
// import http from 'http';
// import { Server } from 'socket.io';
// import helmet from 'helmet';
// import privacyRoute from "./routes/privacyRoute.js"
// import path from "path"
// dotenv.config();

// const app = express();


// const httpServer = http.createServer(app);


// const io = new Server(httpServer, {
//   cors: {
//     origin: '*', 
//     methods: ['GET', 'POST', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   },
// });

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(morgan('dev')); 
// app.use(helmet());    



// app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
// app.use('/privacy.html', express.static(path.join(__dirname, 'public', 'privacy.html')));
// app.use('/', privacyRoute)
// // Routes
// app.get('/', (req, res) => {
//   res.send('App is running');
// });

// app.use('/api/auth', authRoutes);
// app.use('/api/dating', datingRouter);
// app.use('/api/posts',postRouter);

// // Setup Socket.IO
// setupSocket(io);

// // Start server after connecting to the database
// const PORT = process.env.PORT || 6000;

// connectDB().then(() => {
//   httpServer.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// });




























import express from 'express';
import authRoutes from './routes/userRoutes.js';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import datingRouter from './routes/datingRoute.js';
import postRouter from './routes/postRoute.js';
import setupSocket from './config/socketioSetup.js';
import http from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import privacyRoute from './routes/privacyRoute.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

// Create __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/privacy.html', express.static(path.join(__dirname, 'public', 'privacy.html')));
app.use('/', privacyRoute);

// Routes
app.get('/', (req, res) => {
  res.send('App is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/dating', datingRouter);
app.use('/api/posts', postRouter);

// Setup Socket.IO
setupSocket(io);

// Start server after connecting to the database
const PORT = process.env.PORT || 6000;

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

