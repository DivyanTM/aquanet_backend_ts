
import app from "./app";
import dotenv from 'dotenv';
import { createServer } from "http";
import {getConnection} from "./config/dbconfig";
import { Server as SocketIOServer } from "socket.io";
import {initSocket} from "./utils/SocketUtil";


dotenv.config();

const PORT = process.env.PORT || 3000;

const server=createServer(app);

getConnection();

const io=new SocketIOServer(server,{
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }
});

initSocket(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}\n`);
});