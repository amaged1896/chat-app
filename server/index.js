import express from 'express';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

// dirname not working in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const PORT = process.env.PORT || 3500;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const expressServer = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const io = new Server(expressServer, {
    // that allows the socket to be used by any origin or only by the specified origin
    cors: {
        origin: '*'
    }
});


io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);

    // upon connection -  only to user
    socket.emit('message', 'Welcome to our chat application!');

    // upon connection - to all others
    socket.broadcast.emit('message', `User ${socket.id.substring(1, 5)} connected`);

    // listening for a message event
    socket.on('message', data => {
        console.log(data);
        io.emit("message", `${socket.id.substring(0, 5)}: ${data}`);
    });

    // when user disconnects - to all others
    socket.on('disconnect', () => {
        socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)} disconnected`);
    });

    // listen for activity
    socket.on('activity', (name) => {
        socket.broadcast.emit('activity', name);
    });
});

