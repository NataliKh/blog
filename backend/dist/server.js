"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const bootstrap_service_1 = require("./services/bootstrap.service");
const start = async () => {
    await (0, database_1.connectDatabase)();
    await (0, bootstrap_service_1.bootstrap)();
    const app = (0, app_1.createApp)();
    const server = http_1.default.createServer(app);
    server.listen(env_1.env.PORT, () => {
        console.log(`Server is running on port ${env_1.env.PORT}`);
    });
};
void start().catch((error) => {
    console.error('Failed to start the server', error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map