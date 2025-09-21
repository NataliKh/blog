interface SeedRole {
  name: string;
  permissions: string[];
}

export const defaultRoles: SeedRole[] = [
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
