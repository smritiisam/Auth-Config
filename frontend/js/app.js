// Utility functions for the application

// Check if user is authenticated
function isAuthenticated() {
  return localStorage.getItem("token") !== null;
}

// Get stored user data
function getUser() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

// Get authentication token
function getToken() {
  return localStorage.getItem("token");
}

// Logout user
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
}

// Make authenticated API request
async function authenticatedFetch(url, options = {}) {
  const token = getToken();

  if (!token) {
    logout();
    return;
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      // Token expired or invalid
      logout();
      return;
    }

    return response;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// Display notification
function showNotification(message, type = "info") {
  // This can be enhanced with a toast notification library
  console.log(`[${type.toUpperCase()}] ${message}`);
}
