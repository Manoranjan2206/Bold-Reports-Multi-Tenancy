export const DB_SERVER = 'tcp:demo.database.windows.net';
export const DB_USER = 'app_user';
export const MASKED_PASSWORD = '******';

/**
 * Generates a masked connection string based on the isolation model and tenant.
 * @param model The isolation model ('Database per Tenant', 'Schema per Tenant', or 'Shared Database (RLS)')
 * @param tenant The tenant name
 * @returns The connection string with masked password
 */
export const generateConnectionString = (model: string, tenant: string): string => {
  if (model === 'Database per Tenant') {
      return `Server=${DB_SERVER};Database=${tenant.replace(/\s+/g, '_')}_Db;User ID=${DB_USER};Password=${MASKED_PASSWORD};`;
  } else if (model === 'Schema per Tenant') {
      return `Server=${DB_SERVER};Database=Shared_Db;Schema=${tenant.replace(/\s+/g, '')};User ID=${DB_USER};Password=${MASKED_PASSWORD};`;
  } else {
      return `Server=${DB_SERVER};Database=Shared_Db;User ID=${DB_USER};Password=${MASKED_PASSWORD};`;
  }
};
