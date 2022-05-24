import { PassThrough } from 'stream';
import { buffer } from 'stream/consumers';

export enum PacketProcessorState {
    Awaiting, Processing
}

export class PacketProcessor {
    private _state: PacketProcessorState;
    private _buffer: number[];
    private _size: number;

    public constructor() {
        this._state = PacketProcessorState.Awaiting;
        this._buffer = [];
        this._size = 0;
    }

    public write(data: Buffer): void {
        this._buffer.push(...Array.from(data));
    }

    public clear(): void {
        this._buffer = [];
        this._size = 0;
        this._state = PacketProcessorState.Awaiting;
    }

    public tryGetPacket(): Buffer | null {
        if(this._state == PacketProcessorState.Awaiting) {
            if(this._buffer.length < 4) return null;
            
            const buffer = Buffer.from(this._buffer.slice(0, 4));
            const size = buffer.readUInt32LE();

            this._buffer = this._buffer.slice(4);

            this._size = size;
            this._state = PacketProcessorState.Processing;
        }

        if(this._size == PacketProcessorState.Processing) {
            if(this._buffer.length < this._size) return null;
            
            this._state = PacketProcessorState.Awaiting;
            this._size = 0;

            const result = Buffer.from(this._buffer);
            this._buffer = this._buffer.slice(this._size);

            return result;
        }

        return null;
    }
}