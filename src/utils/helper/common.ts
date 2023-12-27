import * as bcrypt from 'bcrypt';

// generate hash to encrypt data
export const generateHash = async (data: string) => {
  if (data) {
    const salt = await bcrypt.genSalt(4);
    return await bcrypt.hash(data, salt);
  }
};

// compare data against encrypt data
export const compareHash = async (data: string, hash: string) => {
  return await bcrypt.compare(data, hash);
};
