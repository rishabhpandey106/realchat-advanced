'use client'
import React , {useState , useEffect} from 'react'
import { useSocket } from '../context/SocketProvider'

export default function Page() {
  const {sendMessage , messages} = useSocket();
  const [message, setMessage] = useState("");
  const [userColors, setUserColors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const uniqueSocketIds = [...new Set(messages.map(msg => msg.socketId))];
    const colors = uniqueSocketIds.reduce<{ [key: string]: string }>((acc, socketId, index) => {
        acc[socketId] = `hsl(${index * 50}, 70%, 50%)`;
        return acc;
    }, {});
    setUserColors(colors);
    }, [messages]);

    const handleSendMessage = () => {
      sendMessage(message);
      setMessage('');
    };

  return (
    <div className="container">
    <h1>WELCOME TO REALCHAT - ADVANCED</h1>
    <br />
    <div className="input-container">
        <input
            className="message-input"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            placeholder="Enter your message"
        />
        <button className="send-button" onClick={handleSendMessage}>
            Send
        </button>
    </div>
    <div className="message-container">
        {messages.map((msg, index) => (
            <li key={index} style={{ color: userColors[msg.socketId] }}>{msg.message}</li>
        ))}
    </div>
    </div>

  )
}
