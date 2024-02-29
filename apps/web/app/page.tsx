'use client'
import React , {useState} from 'react'
import { useSocket } from '../context/SocketProvider'

export default function Page() {
  const {sendMessage , messages} = useSocket();
  const [message, setMessage] = useState("");

  return (
    <div>
      <div>
        <input onChange={(e)=>setMessage(e.target.value)} placeholder='message' />
        <button onClick={e => sendMessage(message)} >Send</button>
      </div>
      <div>
        {messages.map((e)=> <li>{e}</li>)}
      </div>
    </div>
  )
}
