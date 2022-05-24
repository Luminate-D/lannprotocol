import * as net from 'net';
import EventEmitter from 'events';
import { Client } from './client';

export class Server extends EventEmitter {
    private _server: net.Server;

    public constructor(maxListeners: number = 10, maxClientListeners: number = 10) {
        super();
        this.setMaxListeners(maxListeners);

        this._server = new net.Server();
        this._server.on('connection', (socket: net.Socket) => {
            this.emit('connection', new Client(socket, maxClientListeners));
        });
    }

    public close(): void {
        this._server.close();
    }

    public listen(port: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const handler = (error: unknown) => reject(error);
            this._server.once('error', handler);
            this._server.listen(port, '0.0.0.0', () => {
                this._server.off('error', handler);
                resolve();
            });
        });
    }
}