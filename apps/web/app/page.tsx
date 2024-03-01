'use client'
import React , {useState} from 'react'
import { useSocket } from '../context/SocketProvider'

export default function Page() {
  const {sendMessage , messages} = useSocket();
  const [message, setMessage] = useState("");

  return (
    // <div>
    //   <h1>WELCOME TO REALCHAT - ADVANCED</h1>
    //   <br/>
    //   <div>
    //     <input onChange={(e)=>setMessage(e.target.value)} placeholder='message' />
    //     <button onClick={e => sendMessage(message)} >Send</button>
    //   </div>
    //   <div>
    //     {messages.map((e)=> <li>{e}</li>)}
    //   </div>
    // </div>

    <div className="container">
    <h1>WELCOME TO REALCHAT - ADVANCED</h1>
    <br />
    <div className="input-container">
        <input
            className="message-input"
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
        />
        <button className="send-button" onClick={(e) => sendMessage(message)}>
            Send
        </button>
    </div>
    <div className="message-container">
        {messages.map((message, index) => (
            <li key={index}>{message}</li>
        ))}
    </div>
    </div>

  )
}
