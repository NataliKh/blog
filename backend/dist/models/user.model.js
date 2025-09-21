"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    bio: {
        type: String
    },
    avatarUrl: {
        type: String
    }
}, {
    timestamps: true
});
userSchema.pre('save', async function handlePassword(next) {
    if (!this.isModified('password')) {
        next();
        return;
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
    next();
});
userSchema.methods.comparePassword = async function comparePassword(candidate) {
    return bcryptjs_1.default.compare(candidate, this.password);
};
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=user.model.js.map