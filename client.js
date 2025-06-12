const socket = new WebSocket('wss://7d6d-2001-b400-e35c-f46c-a499-a335-32e2-2011.ngrok-free.app');


const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');

function addMessage(content, sender) {
  const wrapper = document.createElement('div');
  wrapper.className = `message-wrapper ${sender}`;

  const message = document.createElement('div');
  message.className = `message ${sender}`;

  if (sender === 'ai') {
    message.innerHTML = marked.parse(content); // 支援 Markdown
  } else {
    message.textContent = content;
  }

  wrapper.appendChild(message);
  chatContainer.appendChild(wrapper);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}


function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  addMessage('正在思考中...', 'ai');

  socket.send(message);
  userInput.value = '';
}

socket.addEventListener('message', (event) => {
  // 移除「正在思考中...」
  const lastAI = document.querySelector('.message-wrapper.ai:last-child');
  if (lastAI) lastAI.remove();

  addMessage(event.data, 'ai');
});

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});
