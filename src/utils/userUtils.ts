export const getUserRole = (user: string): string => {
  if (!user) return 'Viewer';
  const lowerUser = user.toLowerCase();
  return lowerUser.includes('admin') ? 'Administrator' :
         lowerUser.includes('sales') ? 'Sales Representative' : 'Viewer';
};
