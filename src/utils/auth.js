// Save JWT token to localStorage
export function saveToken(token) {
  localStorage.setItem('token', token);
}

// Get JWT token from localStorage
export function getToken() {
  return localStorage.getItem('token');
}

// Remove JWT token from localStorage
export function removeToken() {
  localStorage.removeItem('token');
}

// Save user info to localStorage
export function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

// Get user info from localStorage
export function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Remove user info from localStorage
export function removeUser() {
  localStorage.removeItem('user');
}

// Get auth headers for API requests
export function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}