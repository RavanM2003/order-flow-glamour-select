
// Fix the roleId type in the user setter
// Line 175-176 approximately
setUser({
  id: userData.id,
  email: userData.email,
  firstName: userData.first_name || '',
  lastName: userData.last_name || '',
  role: userData.role as UserRole,
  staffId: userData.staffId || '',
  profileImage: userData.avatar_url || '',
  roleId: userData.roleId?.toString() || ''
});

// Fix the partial user update at line 314
setUser(prevUser => ({
  ...prevUser,
  ...userData
}));
