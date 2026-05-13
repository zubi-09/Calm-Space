// Check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

// Get the authentication token
function getToken() {
    return localStorage.getItem('token');
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}

// Protect routes that require authentication
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
    }
}

// Add authentication headers to fetch requests
async function authenticatedFetch(url, options = {}) {
    const token = getToken();
    if (!token) {
        throw new Error('No authentication token found');
    }

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (response.status === 401) {
            // Token is invalid or expired
            logout();
            return;
        }

        return response;
    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
} 