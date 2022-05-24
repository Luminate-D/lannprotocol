"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcuderConsumerStream = void 0;
const stream_1 = require("stream");
class ProcuderConsumerStream {
    _innerStream;
    _readPosition;
    _writePosition;
    constructor() {
        this._innerStream = new stream_1.PassThrough();
        this._readPosition = 0;
        this._writePosition = 0;
    }
    get available() {
        return this._innerStream.readableLength - this._readPosition;
    }
}
exports.ProcuderConsumerStream = ProcuderConsumerStream;
