import express from 'express';
import dotenv from 'dotenv';

import cors from 'cors';
import bodyParser from 'body-parser';

import Connection from './database/db.js';
import Router from './routes/route.js';

import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();
const __filename=fileURLToPath(import.meta.url);
const __dirname =path.dirname(__filename);


const app = express();

const allowedOrigins = [
  'https://mern-blog-ntal.onrender.com',
  'http://localhost:5173' // Optional: Keep for local testing
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// app.use(express.json());

// app.use(cors());
// app.use(cors({
//    origin: process.env.CLIENT_URL || '*'
// }));

app.use(bodyParser.json({extended:true}))
app.use(bodyParser.urlencoded({extended:true}))

app.use('/',Router);


if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname,'/client/dist')));
}
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/dist/index.html'));
});

// app.get('*',(req,res)=> res.sendFile(path.join(__dirname,'/client/dist/index.html')));

const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>console.log(`Server is running successfully on PORT ${PORT}`));

const USERNAME=process.env.DB_USERNAME;
const PASSWORD=process.env.DB_PASSWORD;

const URL=process.env.MONGODB_URI || `mongodb+srv://${USERNAME}:${PASSWORD}@blog-app.avvgj.mongodb.net/`;
Connection(URL);
