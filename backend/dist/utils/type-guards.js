"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRoleDocument = void 0;
const isRoleDocument = (value) => {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    return 'name' in value && Array.isArray(value.permissions);
};
exports.isRoleDocument = isRoleDocument;
//# sourceMappingURL=type-guards.js.map