"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketProcessor = exports.PacketProcessorState = void 0;
var PacketProcessorState;
(function (PacketProcessorState) {
    PacketProcessorState[PacketProcessorState["Awaiting"] = 0] = "Awaiting";
    PacketProcessorState[PacketProcessorState["Processing"] = 1] = "Processing";
})(PacketProcessorState = exports.PacketProcessorState || (exports.PacketProcessorState = {}));
class PacketProcessor {
    _state;
    _buffer;
    _size;
    constructor() {
        this._state = PacketProcessorState.Awaiting;
        this._buffer = [];
        this._size = 0;
    }
    write(data) {
        this._buffer.push(...Array.from(data));
    }
    clear() {
        this._buffer = [];
        this._size = 0;
        this._state = PacketProcessorState.Awaiting;
    }
    tryGetPacket() {
        if (this._state == PacketProcessorState.Awaiting) {
            if (this._buffer.length < 4)
                return null;
            const buffer = Buffer.from(this._buffer.slice(0, 4));
            const size = buffer.readUInt32LE();
            this._buffer = this._buffer.slice(4);
            this._size = size;
            this._state = PacketProcessorState.Processing;
        }
        if (this._size == PacketProcessorState.Processing) {
            if (this._buffer.length < this._size)
                return null;
            this._state = PacketProcessorState.Awaiting;
            this._size = 0;
            const result = Buffer.from(this._buffer);
            this._buffer = this._buffer.slice(this._size);
            return result;
        }
        return null;
    }
}
exports.PacketProcessor = PacketProcessor;
