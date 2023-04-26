import * as bcrypt from 'bcrypt';

export default async function (password): Promise<string> {
  const saltRounds = 10;
  const hashSalt: string = await bcrypt.genSalt(saltRounds);
  const hashPassword: string = await bcrypt.hash(password, hashSalt);

  return hashPassword;
}
