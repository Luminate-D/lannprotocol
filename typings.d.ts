import EventEmitter from 'events';
import * as net from 'net';

export class Client extends EventEmitter {
    public constructor(socket: net.Socket, maxListeners?: number);
    
    public on(eventName: 'packet', callback: (data: Buffer) => void): this;
    public send(data: Buffer): void;

    public close(): void;
    public connect(host: string, port: number): Promise<void>;
}

export class Server extends EventEmitter {
    public constructor(maxListeners?: number, maxClientListeners?: number);

    public on(eventName: 'connection', callback: (client: Client) => void): this;
    
    public close(): void;
    public listen(port: number): Promise<void>;
}

declare enum PacketProcessorState {
    Awaiting, Processing
}

export class PacketProcessor {
    private _state: PacketProcessorState;
    private _buffer: number[];
    private _size: number;

    public constructor();

    public write(data: Buffer): void;

    public clear(): void;

    public tryGetPacket(): Buffer | null;
}