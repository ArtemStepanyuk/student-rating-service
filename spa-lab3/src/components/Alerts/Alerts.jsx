import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const WS_URL = 'ws://localhost:8081';

export default function Alerts() {
  const { user } = useContext(AuthContext);
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);

  const getTempId = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    return s4() + s4() + '-' + s4();
  };

  useEffect(() => {
    const socket = new WebSocket(WS_URL);

    socket.addEventListener('open', () => {
      const idToSend = user?.id ?? getTempId();
      console.log('[Alerts] WS open, sending userId =', idToSend);
      socket.send(idToSend);
    });

    socket.addEventListener('message', ({ data }) => {
      console.log('[Alerts] Received via WS:', data);
      setMessages(prev => [...prev, data]);
      alert(`New notification: ${data}`);
    });

    socket.addEventListener('close', () => {
      console.log('[Alerts] WS closed');
    });
    socket.addEventListener('error', (err) => {
      console.error('[Alerts] WS error', err);
    });

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [user]);

  const [text, setText] = useState('');
  const sendViaRest = () => {
    const idToSend = user?.id ?? 'unknown';
    fetch('http://localhost:8081/msg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: idToSend, msg: text })
    })
      .then(() => {
        console.log('[Alerts] Sent via REST:', text);
        setText('');
      })
      .catch((err) => {
        console.error('[Alerts] Error sending via REST:', err);
      });
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>WebSocket Alerts</h2>
      <p>
        You are connected to the WebSocket server at <code>ws://localhost:8081</code>. All
        incoming messages will appear via <code>alert()</code> and be added to the list below.
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Message to send to yourself via REST"
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />
        <button onClick={sendViaRest}>Send to Myself (POST /msg)</button>
      </div>

      <div>
        <h3>Message History:</h3>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          <ul>
            {messages.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
