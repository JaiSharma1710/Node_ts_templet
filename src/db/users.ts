import mongoose from 'mongoose';

const UsersSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

type T_CreateUser = {
  email: string;
  username: string;
  authentication: { password: string; salt: string; sessionToken?: string };
};

const UserModal = mongoose.model('User', UsersSchema);

export default UserModal;

export const getUsers = () => UserModal.find();

export const getUsersByEmail = (email: string) => UserModal.findOne({ email });

export const getUserBySession = (sessionToken: string) =>
  UserModal.findOne({ 'authentication.sessionToken': sessionToken });

export const getUserById = (Id: string) => UserModal.findById(Id);

export const createUser = (userData: T_CreateUser) =>
  new UserModal(userData).save().then((user) => user.toObject());

export const deleteUserById = (Id: string) =>
  UserModal.findOneAndDelete({ _id: Id });

export const updateUserById = (Id: string, values: any) =>
  UserModal.findByIdAndUpdate(Id, values);
