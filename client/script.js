(async () => {
  const myUser = await generateRandomUser();
  let activeUsers = [];

  function getCurrentMessage() {
    const messages = document.querySelectorAll('.message');
    if (messages.length > 0) {
      return messages[messages.length - 1];
    }
    return null;
  }

  function updateActiveUsers() {
    const activeUsersContainer = document.getElementById('activeUsersContainer');
    activeUsersContainer.innerHTML = '';
    activeUsers.forEach((user) => {
      const userElement = document.createElement('p');
      userElement.textContent = user.name;
      activeUsersContainer.appendChild(userElement);
    });
  }

  const socket = new WebSocket(generateBackendUrl());
  socket.addEventListener('open', () => {
    console.log('WebSocket connected!');
    socket.send(JSON.stringify({ type: 'newUser', user: myUser }));
  });
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    console.log('WebSocket message:', message);
    switch (message.type) {
      case 'message':
        const messageElement = generateMessage(message, myUser);
        document.getElementById('messages').appendChild(messageElement);
        setTimeout(() => {
          messageElement.classList.add('opacity-100');
        }, 100);
        setTimeout(() => {
          const currentMessage = getCurrentMessage();
          if (currentMessage && currentMessage.type === 'typing') {
            return;
          }
          removeTyping();
        }, 100);
        break;
      case 'activeUsers':
        activeUsers = message.users;
        updateActiveUsers();
        break;
      case 'typing':
        let typingElement = document.getElementById('typing');
        if (!typingElement) {
          typingElement = generateTyping(message, myUser);
          document.getElementById('messages').appendChild(typingElement);
          setTimeout(() => {
            typingElement.classList.add('opacity-100');
          }, 100);
        }
        typingElement.querySelector('p').innerHTML = `${message.users.map(u => u.name).join(', ')} is typing...`;        break;
      default:
        break;
    }
  });
  socket.addEventListener('close', (event) => {
    console.log('WebSocket closed.');
  });
  socket.addEventListener('error', (event) => {
    console.error('WebSocket error:', event);
  });

  // Wait until the DOM is loaded before adding event listeners
  document.addEventListener('DOMContentLoaded', (event) => {
    // Send a message when the send button is clicked
    document.getElementById('sendButton').addEventListener('click', () => {
      const message = document.getElementById('messageInput').value;
      socket.send(JSON.stringify({ type: 'message', message, user: myUser }));
      document.getElementById('messageInput').value = '';
    });
  });

  document.addEventListener('keydown', (event) => {
    // Only send if the typed in key is not a modifier key
    if (event.key.length === 1) {
      socket.send(JSON.stringify({ type: 'typing', user: myUser }));
    }
    // Only send if the typed in key is the enter key
    if (event.key === 'Enter') {
      const message = document.getElementById('messageInput').value;
      socket.send(JSON.stringify({ type: 'message', message, user: myUser }));
      document.getElementById('messageInput').value = '';
    }
  });
})();

//Dark Mode
document.body.classList.add("light-mode");
document.querySelector(".bg-white").classList.add("light-mode");

function myFunction() {
  var element = document.body;
  element.classList.toggle("dark-mode");
  var whiteBackground = document.querySelector(".bg-white");
  whiteBackground.classList.toggle("dark-mode");
}