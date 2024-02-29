import {Server, Socket} from "socket.io"

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
    }

    public initListeners()
    {
        const io = this._io;
        console.log('init socket listeners');
        io.on("connect",(socket)=>{
            console.log('socket connected', socket.id);

            socket.on('event:message', async ({message}:{message : String})=>{
                console.log('new msg recieved',message);
            })
        })
    }

    get io()
    {
        return this._io;
    }
}

export default SocketService;