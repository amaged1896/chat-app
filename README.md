# Chat Application

This is a real-time chat application built using Express.js and Socket.IO.

## Features

- **Real-time Communication**: Utilizes Socket.IO to enable real-time bidirectional event-based communication.
- **Room Functionality**: Users can join different rooms to chat with specific groups of people.
- **User Activity Broadcasting**: Broadcasts messages when a user joins or leaves a room.
- **Typing Indicator**: Displays when a user is typing a message.

## Technologies Used

- **Express.js**: Used as the server-side framework to handle HTTP requests and routing.
- **Socket.IO**: Provides real-time, bidirectional communication between web clients and servers.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/chat-application.git
    ```

2. Navigate to the project directory:

    ```bash
    cd chat-application
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Start the server:

    ```bash
    npm start
    ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Enter your desired username and room name to join.
3. Start chatting with other users in the room!

To test the application with multiple users:

1. Open two or more browser tabs or windows.
2. In each tab/window, navigate to `http://localhost:3000`.
3. Enter different usernames and join the same room.
4. Start chatting with each other across the tabs/windows!
