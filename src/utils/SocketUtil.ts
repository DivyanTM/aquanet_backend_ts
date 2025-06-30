import { Server, Socket, Namespace } from 'socket.io';

let nameSpace: Namespace | undefined;


export function initSocket(io: Server) {
    nameSpace = io.of('/socket');

    nameSpace.on('connection', (socket: Socket) => {
        console.log(`${new Date().toLocaleString()} Device Connected:`, socket.id);

        socket.on('disconnect', () => {
            console.log(`${new Date().toLocaleString()} Device Disconnected:`, socket.id);
        });
    });
}


export function emitData(name:string,data: any) {
    if (nameSpace) {
        nameSpace.emit(name, data);
        console.log("emitted data",data);
    } else {
        console.warn('namespace not initialized!');
    }
}
