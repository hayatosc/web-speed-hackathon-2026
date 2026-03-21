import bcrypt from "bcrypt";

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$/;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 8);
}

export function isBcryptHash(password: string): boolean {
  return BCRYPT_HASH_PATTERN.test(password);
}

export function normalizeStoredPassword(password: string): string {
  return isBcryptHash(password) ? password : bcrypt.hashSync(password, 8);
}

export async function verifyPassword(password: string, storedPassword: string): Promise<boolean> {
  if (!isBcryptHash(storedPassword)) {
    return password === storedPassword;
  }

  return bcrypt.compare(password, storedPassword);
}
