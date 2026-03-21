import bcrypt from 'bcrypt';

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$/;

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(8);
  return bcrypt.hash(password, salt);
}

export function isBcryptHash(password: string): boolean {
  return BCRYPT_HASH_PATTERN.test(password);
}

export async function normalizeStoredPassword(password: string): Promise<string> {
  return isBcryptHash(password) ? password : await hashPassword(password);
}

export async function verifyPassword(password: string, storedPassword: string): Promise<boolean> {
  if (!isBcryptHash(storedPassword)) {
    return password === storedPassword;
  }

  return bcrypt.compare(password, storedPassword);
}
