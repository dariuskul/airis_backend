import { Schema, model } from "mongoose";
import { IUser } from "../types/user";

const UserSchema = new Schema<IUser>({
  balance: {
    type: Number,
    default: 0.0,
  },
  dateOfBirth: {
    type: Date,
    default: new Date(),
  },
  name: {
    type: String,
    required: [true, "Name field is required"],
  },
  passwordHash: {
    type: String,
    required: [true, "Password hash is required"],
  },
  surname: {
    type: String,
    required: [true, "Surname is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
  },
});

const report = model("user", UserSchema);
export default report;
