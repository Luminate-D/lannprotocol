"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = exports.Client = void 0;
const client_1 = require("./tcp/client");
Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return client_1.Client; } });
const server_1 = require("./tcp/server");
Object.defineProperty(exports, "Server", { enumerable: true, get: function () { return server_1.Server; } });
