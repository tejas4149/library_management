import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  password: String,
  role: String,
});

const userModel = mongoose.model("users", userSchema);

export default userModel;
