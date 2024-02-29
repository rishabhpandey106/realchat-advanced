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
    messages: string[];
}
const SocketContext = React.createContext<IsocketContext | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext);
    if(!state) throw new Error(`state not defined`)
    return state;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {

    const [socket , setSocket] = useState<Socket>();
    const [messages , setMessages] = useState<string[]>([]);

    const sendMessage: IsocketContext["sendMessage"] = useCallback((msg)=>{
        console.log('send msg -', msg);
        if(socket)
            socket.emit('event:message', {message: msg});
    },[socket])

    const onMsgRec = useCallback((msg: string)=>{
        console.log(`${msg} recieved on server`);
        const {message} = JSON.parse(msg) as {message: string};
        setMessages((prev)=> [...prev , message])
    },[])

    useEffect(()=>{
        const _socket = io('http://localhost:8000');
        console.log('socket client connected');
        _socket.on('message', onMsgRec);
        setSocket(_socket);

        return()=>{
            _socket.off('message', onMsgRec);
            _socket.disconnect();
            setSocket(undefined);
        }
    },[])

  return (
    <SocketContext.Provider value={{sendMessage , messages}}>
          {children}
    </SocketContext.Provider>
  )
}
