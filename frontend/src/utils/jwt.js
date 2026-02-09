export const decodeToken = (token) => {
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
};

export const getTokenExpiryMs = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  return decoded.exp * 1000;
};

export const isTokenExpired = (token) => {
  const expiryMs = getTokenExpiryMs(token);
  if (!expiryMs) return true;
  return Date.now() >= expiryMs;
};
