import * as argon2 from 'argon2';

const hashPassword = async (password: string) => {
  try {
    return await argon2.hash(password);
  } catch (error) {
    throw new Error(`Failed to hash password: ${error}`, { cause: error });
  }
};

const verifyPassword = async (password: string, hash: string) => {
  try {
    return await argon2.verify(hash, password);
  } catch (error) {
    throw new Error(`Failed to verify password: ${error}`, { cause: error });
  }
};

export { hashPassword, verifyPassword };
