export const authenticate = (username, password) => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.username === username && u.password === password);
  return user ? { username: user.username } : null;
};

export const registerUser = (username, password) => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  if (users.some(u => u.username === username)) {
    return { error: 'Username already exists' };
  }
  
  users.push({ username, password });
  localStorage.setItem('users', JSON.stringify(users));
  return { username };
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};

// Add this new function
export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};