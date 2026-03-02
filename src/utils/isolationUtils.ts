export const getConnectionString = (model: string, tenant: string): string => {
  if (model === 'Database per Tenant') {
      return `Server=tcp:demo.database.windows.net;Database=${tenant.replace(/\s+/g, '_')}_Db;User ID=app_user;Password=******;`;
  } else if (model === 'Schema per Tenant') {
      return `Server=tcp:demo.database.windows.net;Database=Shared_Db;Schema=${tenant.replace(/\s+/g, '')};User ID=app_user;Password=******;`;
  } else {
      return `Server=tcp:demo.database.windows.net;Database=Shared_Db;User ID=app_user;Password=******;`;
  }
};
