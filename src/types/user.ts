
export interface IUser {
  name: string;
  surname: string;
  username: string;
  passwordHash: string;
  dateOfBirth: Date;
  balance: number;
  role: string;
}

export interface ILogin {
  username: string;
  password: string;
}

export interface IRegister {
  name: string;
  surname: string;
  username: string;
  password: string;
  dateOfBirth: Date;
}