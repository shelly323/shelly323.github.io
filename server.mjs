import { WebSocketServer } from 'ws';
import http from 'http';
import axios from 'axios';

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'llama3';

const server = http.createServer();

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('State:client connected');
  ws.on('message', async (message) => {
    const userMessage = message.toString();

    try {
      const response = await axios.post(OLLAMA_URL, {
        model: MODEL_NAME,
        prompt: userMessage,
        stream: false
      });

      const reply = response.data.response;
      ws.send(reply);
    } catch (error) {
      console.error('Error：', error.message);
      ws.send('伺服器錯誤，請稍後再試');
    }
  });

  ws.on('close', () => {
    console.log('State:client disconnected');
  });
});


server.listen(3000, '0.0.0.0', () => {
  console.log('State:Server run');
});
