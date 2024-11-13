import jwtDecode from 'jwt-decode';

// Function to check token expiration
export const isTokenExpired = (accessToken) => {
  if (!accessToken) return true;

  try {
    const decodedToken = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decodedToken.exp < currentTime; // Returns true if token is expired
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Treat token as expired in case of any error
  }
};
