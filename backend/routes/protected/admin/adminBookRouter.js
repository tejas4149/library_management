import { Router } from "express";
import {
  errorResponse,
  sucessResponse,
} from "../../../utils/serverResponse.js";
import bookModel from "../../../models/adminBookModel.js";
import userModel from "../../../models/userModel.js";
import cartModel from "../../../models/cartModel.js";

const adminBookRouter = Router();

adminBookRouter.post("/create", createbookController);
adminBookRouter.get("/getall", getallbookController);
adminBookRouter.put("/update", updatebookController);
adminBookRouter.delete("/delete", deletebookController);


export default adminBookRouter;

async function createbookController(req, res) {
  try {
    if (!res.locals.email || !res.locals.role) {
      return errorResponse(res, 401, "unauthorized: missign email or role");
    }
    const { email, role } = res.locals;
    console.log(res.locals);

    const { title, author, ISBN_code, category, publishedDate } = req.body;
    const book = await bookModel.create({
      title,
      author,
      ISBN_code,
      category,
      publishedDate,
      email,
      role,
    });
    return sucessResponse(res, "book created sucessfully", book);
  } catch (error) {
    console.log("createbookController__", error);
    return errorResponse(res, 500, "internal server error");
  }
}
async function getallbookController(req, res) {
  try {
    const { email } = res.locals;
    console.log("locals", email);
    if (!email) {
      return errorResponse(res, 403, "Unauthorized access.");
    }
    const books = await bookModel.find();

    if (books.length === 0) {
      return errorResponse(res, 404, "No bookss found.");
    }
    return sucessResponse(res, "sucess", books);
  } catch (error) {
    console.log("getallbookController__", error);
    return errorResponse(res, 500, "internal server error");
  }
}
async function updatebookController(req, res) {
  try {
    const id = req.query.id?.trim();
    const updatebookData = req.body;
    if (!id) {
      return errorResponse(res, 400, "id is not provided");
    }
    const updateBook = await bookModel.findByIdAndUpdate(id, updatebookData);
    return sucessResponse(res, "book data sucessfully");
  } catch (error) {
    console.log("updatebookController__", error);
    return errorResponse(res, 500, "internal server error");
  }
}
async function deletebookController(req, res) {
  try {
    const id = req.id?.time();
    if (!id) {
      return errorResponse(res, 400, "id is not provides");
    }

    const deleteBook = await bookModel.findByIdAndDelete(id);
    return sucessResponse(res, "book delete sucessfully");
  } catch (error) {
    console.log("deleteBookController__", error);
    return errorResponse(res, 500, "internal server error");
  }
}
