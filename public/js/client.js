const socket = io(); // This should work automatically

// Get references to DOM elements
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// Sound for notifications
var audio = new Audio('/audio/ting.mp3'); // Adjusted the path to match the public directory

// Function to append messages to the chat container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    
    if (position === 'left') {
        audio.play(); // Play sound notification for received messages
    }
};

// Prompt for user's name
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right'); // Display sent message
    socket.emit('send', message); // Send message to the server
    messageInput.value = ''; // Clear input field
});

// If a new user joins, receive their name from the server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right'); // Notify new user joined
});

// If server sends a message, receive it
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left'); // Display received message
});

// If a user leaves the chat, append the info to the container
socket.on('left', name => {
    append(`${name} left the chat`, 'right'); // Notify user left
});
