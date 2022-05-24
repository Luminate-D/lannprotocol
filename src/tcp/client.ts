import * as net from 'net';
import EventEmitter from 'events';
import { PacketProcessor } from '../processor';

export class Client extends EventEmitter {
    private _socket: net.Socket;
    private _processor: PacketProcessor;

    public constructor(socket: net.Socket, maxListeners: number = 10) {
        super();
        this.setMaxListeners(maxListeners);

        this._socket = socket ?? new net.Socket();
        this._processor = new PacketProcessor();

        this._socket.on('data', (data: Buffer) => {
            this._processor.write(data);

            const packet = this._processor.tryGetPacket();
            if(!packet) return;

            this.emit('packet', packet);
        });
    }

    public close(): void {
        this._socket.destroy();
        this._processor.clear();
    }

    public send(data: Buffer) {
        const buffer = Buffer.alloc(data.length + 4);

        buffer.writeUInt32LE(data.length);
        data.copy(buffer, 4, 0, data.length);

        this._socket.write(buffer);
    }

    public connect(host: string, port: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const handler = (error: unknown) => reject(error);
            this._socket.once('error', handler);
            this._socket.connect({ host, port }, () => {
                this._socket.off('error', handler);
                resolve();
            });
        });
    }
}