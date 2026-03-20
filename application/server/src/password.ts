import bcrypt from "bcrypt";

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$/;

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

export function isBcryptHash(password: string): boolean {
  return BCRYPT_HASH_PATTERN.test(password);
}

export function normalizeStoredPassword(password: string): string {
  return isBcryptHash(password) ? password : hashPassword(password);
}

export function verifyPassword(password: string, storedPassword: string): boolean {
  if (!isBcryptHash(storedPassword)) {
    return password === storedPassword;
  }

  return bcrypt.compareSync(password, storedPassword);
}
