import { Router } from "express";
import { errorResponse, sucessResponse } from "../../utils/serverResponse.js";
import userModel from "../../models/userModel.js";
import { comparePassword } from "../../utils/encryptPassword.js";
import { generateToken } from "../../utils/jwtTokens.js";

const authRouter = Router();

authRouter.post("/signin", signinController);
authRouter.post("/forgot", forgotPasswordController);
authRouter.post("/reset", resetPasswordController);

export default authRouter;

async function signinController(req, res) {
  try {
    const { email, password } = req.body;
    // console.log("email:", email);
    if (!email || !password) {
      return errorResponse(res, 400, "email and password are requires");
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "user not found");
    }
    const isPassword = comparePassword(password, user.password);
    if (!isPassword) {
      return errorResponse(res, 401, "invalid password.");
    }
    const tokens = generateToken({
      email: user.email,
      role: user.role,
    });

    return sucessResponse(res, "signin sucessfull", tokens);
  } catch (error) {
    console.log("error during signup", error);
    errorResponse(res, 500, "internal server error");
  }
}

//forgot
async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, 400, "email and password are required.");
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 400, "user not found");
    }
    const randomNum = Math.round(Math.random() * 100000);
    const forgototp = randomNum < 1000000 ? randomNum + 100000 : randomNum;

    await userModel.findOneAndUpdate({ email }, { forgototp });
    //fuction to email otp to user email -

    //
    return sucessResponse(res, "otp generate successful.", { otp: forgototp });
  } catch (error) {
    console.log("error during signin", error);
    errorResponse(res, 500, "internal server error");
  }
}
//reset

async function resetPasswordController(req, res) {
  try {
    const { email, otp, password } = req.body;

    if (!email) {
      return errorResponse(res, 400, "email and password are required.");
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 400, "user not found");
    }

    if (user.forgototp !== Number.otp) {
      return errorResponse(res, 400, "invalid otp");
    }

    await userModel.findOneAndUpdate(
      { email },
      { password: hashPassword(password) }
    );

    return sucessResponse(res, "password reset successful");
  } catch (error) {
    console.log("error during signin", error);
    errorResponse(res, 500, "internal server error");
  }
}
