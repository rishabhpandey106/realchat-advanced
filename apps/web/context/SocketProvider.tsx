'use client'
import { connected } from 'process';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {io , Socket} from 'socket.io-client'

interface SocketProviderProps
{
    children?: React.ReactNode
}
interface IsocketContext
{
    sendMessage: (msg: string)=> any;
    messages: { socketId: string; message: string }[];
    joinRoom: (roomId: string) => void;
    leaveRoom: (roomId: string) => void;
    sendPrivateMessage: (msg: string, roomId: string)=> any;
    privmessages: {senderId: string, roomId: string, message: string}[];
}
const SocketContext = React.createContext<IsocketContext | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext);
    if(!state) throw new Error(`state not defined`)
    return state;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {

    const [socket , setSocket] = useState<Socket>();
    const [messages , setMessages] = useState<{socketId: string, message: string}[]>([]);
    const [privmessages , setPrivmessages] = useState<{senderId: string, roomId: string, message: string}[]>([]);

    const sendMessage = useCallback((msg: string) => {
        console.log('send msg -', msg);
        if (socket) {
            socket.emit('event:message', {message: msg, socketId: socket.id});
        }
    }, [socket]);

    const sendPrivateMessage = useCallback((msg: string, roomId: string) => {
      console.log('send msg -', msg);
      if (socket) {
          socket.emit('privateMessage', { message: msg, roomId, senderId: socket.id });
      }
  }, [socket]);
    
    const joinRoom = useCallback((roomId: string) => {
        console.log('joining room', roomId);
        if (socket) {
          socket.emit('joinRoom', { roomId });
        }
      }, [socket]);
    
    const leaveRoom = useCallback((roomId: string) => {
    console.log('leaving room', roomId);
    if (socket) {
        socket.emit('leaveRoom', { roomId });
    }
    }, [socket]);

    const onMsgRec = useCallback(({message, socketId}: {message: string, socketId: string})=>{
        console.log(`${message} recieved on server by socket id ${socketId}`);
        // const {message} = JSON.parse(msg) as {message: string};
        setMessages((prev)=> [...prev , {socketId, message}])
    },[])

    const onPriMsgRec = useCallback(({message, roomId , senderId}: {message: string, roomId: string, senderId: string})=>{
      console.log(`${message} recieved on server by socket id ${senderId} on room ${roomId}`);
      // const {message} = JSON.parse(msg) as {message: string};
      setPrivmessages((prev)=> [...prev , {senderId, roomId , message}])
  },[])

    useEffect(()=>{
        const _socket = io('http://localhost:8000');
        console.log('socket client connected');
        _socket.on('message', onMsgRec);
        _socket.on("p_message" , onPriMsgRec);
        setSocket(_socket);

        return()=>{
            _socket.off('message', onMsgRec);
            _socket.off('p_message', onPriMsgRec);
            _socket.disconnect();
            setSocket(undefined);
        }
    },[onMsgRec, onPriMsgRec])

  return (
    <SocketContext.Provider value={{ sendMessage, joinRoom, leaveRoom, messages, sendPrivateMessage, privmessages }}>
          {children}
    </SocketContext.Provider>
  )
}
