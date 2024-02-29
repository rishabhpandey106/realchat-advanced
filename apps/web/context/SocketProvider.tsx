'use client'
import { connected } from 'process';
import React, { useCallback, useContext, useEffect } from 'react'
import {io} from 'socket.io-client'

interface SocketProviderProps
{
    children?: React.ReactNode
}
interface IsocketContext
{
    sendMessage: (msg: string)=> any;
}
const SocketContext = React.createContext<IsocketContext | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext);
    if(!state) throw new Error(`state not defined`)
    return state;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {
    const sendMessage: IsocketContext['sendMessage'] = useCallback((msg)=>{
        console.log('send msg -', msg);
    },[])

    useEffect(()=>{
        const _socket = io('http://localhost:8000');
        console.log('socket client connected');

        return()=>{
            _socket.disconnect();
        }
    },[])

  return (
    <SocketContext.Provider value={null}>
          {children}
    </SocketContext.Provider>
  )
}
