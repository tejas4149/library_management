import { Router } from "express";
import {
  errorResponse,
  sucessResponse,
} from "../../../utils/serverResponse.js";
import userModel from "../../../models/userModel.js";
import { hashPassword } from "../../../utils/encryptPassword.js";

const adminUserRouter = Router();

adminUserRouter.post("/create", createUserController);
adminUserRouter.get("/getall", getuserController);
adminUserRouter.put("/update", updateUserController);
adminUserRouter.post("/delete", deleteUserController);

export default adminUserRouter;

async function createUserController(req, res) {
  try {
    const { fname, lname, email, password, role } = req.body;
    console.log("userdata", req.body);

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, "user already exist");
    }

    //create user
    await userModel.create({
      fname,
      lname,
      email,
      password: hashPassword(password),
      role,
    });
    return sucessResponse(res, "user created sucessfully", { email, role });
  } catch (error) {
    console.log("createUserController__", error);
    errorResponse(res, 500, "internal Server Error");
  }
}
async function getuserController(req, res) {
  try {
    const { email } = res.locals;
    console.log("locals", email);

    const alluser = await userModel.find({ email });
    return sucessResponse(res, "sucess", alluser);
  } catch (error) {
    console.log("getallUserController__", error);
    errorResponse(resolve, 500, "internal Server Error");
  }
}
async function updateUserController(req, res) {
  try {
    const id = req.query?.trim();
    const updateData = req.body;
    if (!id) {
      return errorResponse(resolve, 400, "id is not provided");
    }
    const updatdataUser = await userModel.findByIdAndUpdate(id, updateData);
    return sucessResponse(res, "updated sucessfully", updatdataUser);
  } catch (error) {
    console.log("updateUserController__", error);
    errorResponse(resolve, 500, "internal Server Error");
  }
}
async function deleteUserController(req, res) {
  try {
    const id = req.id?.trim();
    if (!id) {
      return errorResponse(resolve, 400, "id is not provided.");
    }
    const deleteUser = await userModel.findByIdAndDelete(id);
    return sucessResponse(resolve, "sucessfully deleted", deleteUser);
  } catch (error) {
    console.log("deleteUserController__", error);
    errorResponse(res, 500, "internal Server Error");
  }
}
