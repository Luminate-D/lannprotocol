"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const net = __importStar(require("net"));
const events_1 = __importDefault(require("events"));
const client_1 = require("./client");
class Server extends events_1.default {
    _server;
    constructor(maxListeners = 10, maxClientListeners = 10) {
        super();
        this.setMaxListeners(maxListeners);
        this._server = new net.Server();
        this._server.on('connection', (socket) => {
            this.emit('connection', new client_1.Client(socket, maxClientListeners));
        });
    }
    close() {
        this._server.close();
    }
    listen(port) {
        return new Promise((resolve, reject) => {
            const handler = (error) => reject(error);
            this._server.once('error', handler);
            this._server.listen(port, '0.0.0.0', () => {
                this._server.off('error', handler);
                resolve();
            });
        });
    }
}
exports.Server = Server;
