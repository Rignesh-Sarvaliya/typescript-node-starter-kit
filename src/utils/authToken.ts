import { signJwt, verifyJwt } from "@/utils/jwt";

// Store currently issued auth tokens in memory
const authTokenStore = new Map<number, string>();

export const issueAuthToken = (id: number, role: 'user' | 'admin'): string => {
  const token = signJwt({ id, role, iat: Date.now() });
  authTokenStore.set(id, token);
  return token;
};

export const verifyAuthToken = <T extends { id: number; role: string }>(token: string): T | null => {
  const payload = verifyJwt<T>(token);
  if (!payload) return null;
  const stored = authTokenStore.get(payload.id);
  if (stored !== token) return null;
  return payload;
};

export const invalidateAuthToken = (id: number) => {
  authTokenStore.delete(id);
};
