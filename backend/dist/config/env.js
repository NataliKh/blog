"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = parseInt(process.env.PORT ?? '4000', 10);
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/blog';
const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1d';
const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173';
exports.env = {
    PORT,
    MONGO_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    CLIENT_URL
};
//# sourceMappingURL=env.js.map