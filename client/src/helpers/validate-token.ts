import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string) => {
  const decoded = jwtDecode(token);
  const currentTime = new Date();
  if (decoded.exp) {
    const exp = new Date(decoded.exp * 1000);
    if (currentTime >= exp) return true;
    else return false;
  }

  return true;
};
