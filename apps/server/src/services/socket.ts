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

            socket.on('event:message', async ({message, socketId}:{message : String, socketId: string})=>{
                console.log('new msg recieved',message, 'from socketId', socketId);
                await pub.publish("MESSAGES" , JSON.stringify({message, socketId}));
            })
        })

        sub.on("message",async (channel , message)=>{
            if(channel === "MESSAGES"){
                console.log('new msg on server', message);
                const {message: msg, socketId} = JSON.parse(message) as {message: string, socketId: string};
                io.emit("message" , {message: msg, socketId})
                await produceMessage(message);
                //added socket id coloring
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