// pages/private-messaging.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketProvider'
import styles from "./styles.module.css";

const PrivateMessagingPage: React.FC = () => {
  const { privmessages, sendPrivateMessage, joinRoom, leaveRoom } = useSocket();
  const [message, setMessage] = useState('');
  const [roomId, setRoomId] = useState('');
  const [inRoom, setInRoom] = useState(false);

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleRoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(event.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      sendPrivateMessage(message, roomId);
      setMessage('');
    }
  };

  const handleJoinRoom = () => {
    if (roomId.trim() !== '') {
      joinRoom(roomId);
      setInRoom(true);
    }
  };

  const handleLeaveRoom = () => {
    if (roomId.trim() !== '') {
      leaveRoom(roomId);
      setInRoom(false);
    }
  };

  return (
    <div className={styles.body}>
      <h1 className={styles.h1}>Private Messaging</h1>
        <div className={styles.container}>
        <input className={styles.input} type="text" placeholder="Room ID" value={roomId} onChange={handleRoomChange} />
        <button className={styles.button} onClick={handleJoinRoom}>Join Room</button>
        <button className={styles.button} onClick={handleLeaveRoom}>Leave Room</button>
        <br />
        <input className={styles.input} type="text" placeholder="Message" value={message} onChange={handleMessageChange} />
        <button className={styles.button} onClick={handleSendMessage} disabled={!inRoom}>Send</button>
        <div className={styles.message_container}>
        <ul>
            {roomId && privmessages.map((msg, index) => (
              <li key={index}>{msg.message}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    
  );
};

export default PrivateMessagingPage;
