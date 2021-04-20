import { Schema, Document, model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { voidFn, User, Roles } from '@node-api-gateway/api-interfaces';
import { globalConfig } from '@node-api-gateway/config';

const { cryptoSaltRounds } = globalConfig;

export interface UserDoc extends User, Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (givenPass: string, cb?: voidFn) => void | boolean;
  isAdmin: () => boolean;
}

export const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, immutable: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    resetToken: { type: String, required: false },
    resetTokenExpires: { type: Date, required: false },
    providerId: { type: String, required: false },
    provider: { type: String, required: false },
    role: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<UserDoc>('save', function (this, next) {
  const user = this as UserDoc;

  if (user?.isModified('password')) {
    const salt = genSaltSync(cryptoSaltRounds);
    user.password = hashSync(user.password, salt);
  }

  return next();
});

UserSchema.methods.comparePassword = function (givenPass: string, cb?: voidFn) {
  const user = this as UserDoc;

  const isValid = compareSync(givenPass, user.password);
  if (cb) cb(isValid);
  return isValid;
};

UserSchema.methods.isAdmin = function () {
  return (this as UserDoc).role === Roles.Admin;
};

const UserModel = model<UserDoc>('Users', UserSchema);

export default UserModel;
