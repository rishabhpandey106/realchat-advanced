import {Server, Socket} from "socket.io"
import Redis , { Redis as RedisClient } from "ioredis"
import prismaClient from "./prisma";
import { produceMessage , producePrivateMessage} from "./kafka";


const pub = new Redis({
    host: '000000000000000000000',
    port: 21307,
    username: 'default',
    password: '00000000000000',
});
const sub = new Redis({
    host: '000000000000000000000',
    port: 21307,
    username: 'default',
    password: '00000000000000',
});

const roomSubscriptions = new Map<string, RedisClient>();

function subscribeToRoom(roomId: string) {
    if (!roomSubscriptions.has(roomId)) {
        sub.subscribe(`PRIVATEMESSAGES:${roomId}`);
        roomSubscriptions.set(roomId, sub);
    }
}

function unsubscribeFromRoom(roomId: string) {
    const sub = roomSubscriptions.get(roomId);
    if (sub) {
        sub.unsubscribe(`PRIVATEMESSAGES:${roomId}`);
        roomSubscriptions.delete(roomId);
    }
}

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

            socket.on('joinRoom', ({ roomId }: { roomId: string }) => {
                console.log('joining room', roomId);
                socket.join(roomId);
                subscribeToRoom(roomId);
                socket.join(roomId);
            });

            socket.on('leaveRoom', ({ roomId }: { roomId: string }) => {
                console.log('leaving room', roomId);
                socket.leave(roomId);
                unsubscribeFromRoom(roomId);
            });

            socket.on('privateMessage', async ({ message, roomId, senderId }: { message: string, roomId: string, senderId: string }) => {
                console.log('private message received', message, 'from roomId', roomId, 'by senderId', senderId);
                // io.to(roomId).emit('privateMessage', { message, senderId });
                await pub.publish(`PRIVATEMESSAGES:${roomId}`, JSON.stringify({ message, roomId, senderId }));
            });

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
            else if(channel.startsWith("PRIVATEMESSAGES:"))  
            {
                const [, roomId] = channel.split(":");
                console.log("new private msg on server", message);
                const { message: msg, senderId } = JSON.parse(message) as { message: string, senderId: string };
                io.to(roomId).emit("p_message", { message: msg, roomId, senderId });
                await producePrivateMessage(message);
                console.log(' private msg produced to kafka');
            }   
        })
    }

    get io()
    {
        return this._io;
    }
}

export default SocketService;