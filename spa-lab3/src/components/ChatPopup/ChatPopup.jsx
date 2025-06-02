import React, { useEffect, useState, useRef, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './ChatPopup.scss';

const WS_URL = 'ws://localhost:8081';

export default function ChatPopup() {
  const { user } = useContext(AuthContext);
  const [ws, setWs] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [inputText, setInputText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const socket = new WebSocket(WS_URL);

    socket.addEventListener('open', () => {
      socket.send(
        JSON.stringify({
          type: 'register',
          userId: user.id,
          role: user.role
        })
      );
      socket.send(JSON.stringify({ type: 'get_users' }));
    });

    socket.addEventListener('message', ({ data }) => {
      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch (err) {
        console.error('Invalid JSON from WS:', data);
        return;
      }

      if (parsed.type === 'user_list') {
        setOnlineUsers(parsed.users.filter(u => u.userId !== user.id));
      } else if (parsed.type === 'message') {
        const { from, text, timestamp } = parsed.payload;
        setMessages(prev => {
          const oldArr = prev[from] || [];
          return {
            ...prev,
            [from]: [...oldArr, { from, text, timestamp }]
          };
        });
        if (activeChat === from) {
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }
      } else if (parsed.type === 'error') {
        console.error('Server error:', parsed.text);
      }
    });

    socket.addEventListener('close', () => {
      console.log('WebSocket closed');
    });
    socket.addEventListener('error', err => {
      console.error('WebSocket error', err);
    });

    setWs(socket);
    return () => {
      socket.close();
    };
  }, [user, activeChat]);

  const sendMessage = () => {
    if (!inputText.trim() || !activeChat) return;
    const msgObj = {
      type: 'message',
      payload: {
        to: activeChat,
        text: inputText.trim(),
        from: user.id
      }
    };
    ws.send(JSON.stringify(msgObj));
    setMessages(prev => {
      const oldArr = prev[activeChat] || [];
      return {
        ...prev,
        [activeChat]: [
          ...oldArr,
          { from: user.id, text: inputText.trim(), timestamp: Date.now() }
        ]
      };
    });
    setInputText('');
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const openChatWith = otherId => {
    setActiveChat(otherId);
    setIsOpen(true);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (!user) return null;

  return (
    <div className={`chat-popup ${isOpen ? 'open' : 'closed'}`}>
      <div className="chat-header" onClick={() => setIsOpen(o => !o)}>
        <span>💬 Chat</span>
        <span className="toggle-button">{isOpen ? '−' : '+'}</span>
      </div>

      {isOpen && (
        <div className="chat-body">
          <div className="chat-users-list">
            <h4>Online:</h4>
            {onlineUsers.length === 0 && <p>No one is online</p>}
            {onlineUsers.map(u => (
              <div
                key={u.userId}
                className={`chat-user-item ${
                  activeChat === u.userId ? 'active' : ''
                }`}
                onClick={() => openChatWith(u.userId)}
              >
                {u.userId} ({u.role})
              </div>
            ))}
          </div>

          {activeChat ? (
            <div className="chat-conversation">
              <div className="chat-conversation-header">
                Chat with: {activeChat}
                <button onClick={() => setActiveChat(null)}>×</button>
              </div>
              <div className="chat-messages">
                {(messages[activeChat] || []).map((m, idx) => (
                  <div
                    key={idx}
                    className={`chat-message ${
                      m.from === user.id ? 'sent' : 'received'
                    }`}
                  >
                    <span className="msg-text">{m.text}</span>
                    <span className="msg-time">
                      {new Date(m.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="chat-input-area">
                <input
                  type="text"
                  placeholder="Message..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') sendMessage();
                  }}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </div>
          ) : (
            <div className="chat-placeholder">
              Select a user to start chat
            </div>
          )}
        </div>
      )}
    </div>
  );
}
