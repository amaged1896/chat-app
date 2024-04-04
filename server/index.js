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

    socket.on('message', data => {
        console.log(data);
        io.emit("message", `${socket.id.substring(0, 5)}: ${data}`);
    });
});

