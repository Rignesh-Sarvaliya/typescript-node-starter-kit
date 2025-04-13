export const formatUserForAdmin = (u: any) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  created_at: u.created_at,
  status: u.status,
});

export const formatUserListForAdmin = (users: any[]) =>
  users.map(formatUserForAdmin);
