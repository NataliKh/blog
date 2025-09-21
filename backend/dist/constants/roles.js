"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRoles = void 0;
exports.defaultRoles = [
    {
        name: 'admin',
        permissions: ['*']
    },
    {
        name: 'editor',
        permissions: [
            'articles:create',
            'articles:update',
            'articles:publish',
            'articles:delete',
            'comments:moderate'
        ]
    },
    {
        name: 'user',
        permissions: ['articles:read', 'comments:create']
    }
];
//# sourceMappingURL=roles.js.map