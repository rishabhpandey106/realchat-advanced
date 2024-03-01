import {Server, Socket} from "socket.io"
import Redis from "ioredis"
import prismaClient from "./prisma";
import { produceMessage } from "./kafka";

const pub = new Redis({
    host: 'redis-11150278-rishabh.a.aivencloud.com',
    port: 21307,
    username: 'default',
    password: 'AVNS_ieYi7TdZvY0J4mJ6LN-',
});
const sub = new Redis({
    host: 'redis-11150278-rishabh.a.aivencloud.com',
    port: 21307,
    username: 'default',
    password: 'AVNS_ieYi7TdZvY0J4mJ6LN-',
});

class SocketService
{
    private _io: Server;
    constructor(){
        console.log('socket init')
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            }
        });
        sub.subscribe("MESSAGES");
    }

    public initListeners()
    {
        const io = this._io;
        console.log('init socket listeners');
        io.on("connect",(socket)=>{
            console.log('socket connected', socket.id);

            socket.on('event:message', async ({message}:{message : String})=>{
                console.log('new msg recieved',message);
                await pub.publish("MESSAGES" , JSON.stringify({message}));
            })
        })

        sub.on("message",async (channel , message)=>{
            if(channel === "MESSAGES"){
                console.log('new msg on server', message);
                io.emit("message" , message)
                await produceMessage(message);
                console.log('msg produced to kafka')
            }         
        })
    }

    get io()
    {
        return this._io;
    }
}

export default SocketService;