import express from 'express';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

// dirname not working in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const PORT = process.env.PORT || 3500;
const ADMIN = "Admin";

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const expressServer = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// state

const UsersState = {
    users: [],
    setUsers: function (newUsersArray) {
        this.users = newUsersArray;
        // this.notify();
    }
};



const io = new Server(expressServer, {
    // that allows the socket to be used by any origin or only by the specified origin
    cors: {
        origin: '*'
    }
});


io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);

    // upon connection -  only to user
    socket.emit('message', buildMessage(ADMIN, 'Welcome to our chat application'));

    socket.on("enterRoom", ({ name, room }) => {

        // leave previous room
        const prevRoom = getUser(socket.id)?.room;
        if (prevRoom) {
            socket.leave(prevRoom);
            io.to(prevRoom).emit('message', buildMessage(ADMIN, `${name} has left the room`));
        }

        const user = activateUser(socket.id, name, room);

        // cannot update previous room users list until after the
        // state update in activate user

        if (prevRoom) {
            io.to(prevRoom).emit('userList', {
                users: getUsersInRoom(prevRoom)
            });
        }
        // join room
        socket.join(user.room);

        // to the user who joined
        socket.emit('message', buildMessage(ADMIN, `You have joined the ${user.room} chat room`));

        // to everyone in the room
        socket.broadcast.to(user.room).emit('message', buildMessage(ADMIN, `${user.name} has joined the room`));

        // update users list in the room
        io.to(user.room).emit('userList', {
            users: getUsersInRoom(user.room)
        });

        // update rooms list for everyone
        io.emit('roomList', {
            rooms: getAllActiveRooms()
        });
    });


    // when user disconnects - to all others
    socket.on('disconnect', () => {
        const user = getUser(socket.id);
        userLeavesApplication(socket.id);

        if (user) {
            io.to(user.room).emit('message', buildMessage(ADMIN, `${user.name} has left the room`));

            // update users list in the room
            io.to(user.room).emit('userList', {
                users: getUsersInRoom(user.room)
            });

            io.emit('roomList', {
                rooms: getAllActiveRooms()
            });
        }

        console.log(`User ${socket.id} connected`);
    });

    // listening for a message event
    socket.on('message', ({ name, text }) => {
        const room = getUser(socket.id)?.room;
        if (room) {
            io.to(room).emit('message', buildMessage(name, text));
        }
    });

    // listen for activity
    socket.on('activity', (name) => {
        const room = getUser(socket.id)?.room;
        if (room) {
            socket.broadcast.to(room).emit('activity', name);
        }
    });
});



function buildMessage(name, text) {
    return {
        name,
        text,
        time: new Intl.DateTimeFormat('en-EG', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format(new Date())
    };
}

// user functions
function activateUser(id, name) {
    const user = { id, name, room };
    UsersState.setUsers([
        ...UsersState.users?.filter(user => user.id !== id),
        user
    ]);
    return user;
}

function userLeavesApplication(id) {
    UsersState.setUsers(UsersState.users.filter(user => user.id !== id));
}

function getUser(id) {
    return UsersState.users.find(user => user.id === id);
}

function getUsersInRoom(room) {
    return UsersState.users.filter(user => user.room === room);
}

function getAllActiveRooms() {
    return Array.from(new Set(UsersState.users.map(user => user.room)));
}