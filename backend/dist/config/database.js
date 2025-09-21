"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const connectDatabase = async () => {
    if (mongoose_1.default.connection.readyState === 1) {
        return;
    }
    await mongoose_1.default.connect(env_1.env.MONGO_URI);
};
exports.connectDatabase = connectDatabase;
//# sourceMappingURL=database.js.map