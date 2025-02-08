import { Router } from "express";
import bookModel from "../../../models/adminBookModel.js";
import {
  errorResponse,
  sucessResponse,
} from "../../../utils/serverResponse.js";
import userModel from "../../../models/userModel.js";
import cartModel from "../../../models/cartModel.js";
import borrowModel from "../../../models/borrowModel.js";

const userBookRouter = Router();

//routes
userBookRouter.get("/getall", getallBookuserController);
userBookRouter.post("/cart", addtoCartController);
userBookRouter.post("/buy", checkOutController);
userBookRouter.get("/getcart", getcartController);
userBookRouter.delete("/deletecart", deletecartController);

export default userBookRouter;

//get all book controller
async function getallBookuserController(req, res) {
  try {
    const { email, role } = res.locals;
    // console.log("locals:", email, role);
    const books = await bookModel.find();
    return sucessResponse(res, "Success", books);
  } catch (error) {
    console.log("_getallBlogController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

//add to cart controller
async function addtoCartController(req, res) {
  try {
    const { email } = res.locals;
    const { bookId } = req.body;

    if (!bookId) {
      return errorResponse(res, 400, "Book ID is required.");
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "user not found");
    }
    const existingCartItems = await cartModel.findOne({
      userId: user._id,
      bookId,
    });
    if (existingCartItems)
      return errorResponse(res, 400, "book already in cart");

    const newCartItem = new cartModel({ userId: user._id, bookId });
    await newCartItem.save();
    return sucessResponse(res, "book added to cart");
  } catch (error) {
    console.log("addtoCart__", error);
    return errorResponse(res, 500, "internal server error");
  }
}

async function checkOutController(req, res) {
  try {
    const { email } = res.locals;
    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "user not found");
    }
    const cartItems = await cartModel.find({ userId: user._id });
    if (cartItems.length === 0) return errorResponse(res, 400, "cart is empty");

    const borrowedBooks = [];
    for (let cartItem of cartItems) {
      const book = await bookModel.findById(cartItem.bookId);

      if (!book || book.availableCopies <= 0) continue;

      const existingBorrow = await borrowModel.findOne({
        userId: user._id,
        bookId: book._id,
        returned: false,
      });
      if (existingBorrow) continue;

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      const newBorrow = new borrowModel({
        userId: user._id,
        bookId: book._id,
        borrowDate: new Date(),
        dueDate,
        returned: false,
      });

      await newBorrow.save();
      borrowedBooks.push(newBorrow);

      book.availableCopies -= 1;
      await book.save();
    }
    await cartModel.deleteOne({ userId: user._id });
    if (borrowedBooks.length === 0) {
      return errorResponse(res, 400, "no books are avaliable to Borrow.");
    }
    return sucessResponse(res, "book borrowed sucessfully.", borrowedBooks);
  } catch (error) {
    console.log("checkOutController___", error);
    return errorResponse(res, 500, "internal server error");
  }
}


// async function checkOutController(req, res) {
//   try {
//     const { email } = res.locals;

//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return errorResponse(res, 404, "User not found");
//     }

//     // Fetch books in the user's cart
//     const cartItems = await cartModel.find({ userId: user._id });
//     if (cartItems.length === 0) {
//       return errorResponse(res, 400, "Cart is empty");
//     }

//     const borrowedBooks = [];
//     const unavailableBooks = [];

//     for (let cartItem of cartItems) {
//       const book = await bookModel.findById(cartItem.bookId);

//       if (!book) {
//         unavailableBooks.push(`Book ID ${cartItem.bookId} not found`);
//         continue;
//       }

//       if (book.availableCopies <= 0) {
//         unavailableBooks.push(`Book "${book.title}" is out of stock`);
//         continue;
//       }

//       const existingBorrow = await borrowModel.findOne({
//         userId: user._id,
//         bookId: book._id,
//         returned: false,
//       });

//       if (existingBorrow) {
//         unavailableBooks.push(`You have already borrowed "${book.title}"`);
//         continue;
//       }

//       // Process borrowing
//       const returnDate = new Date();
//       returnDate.setDate(returnDate.getDate() + 15);

//       const newBorrow = new borrowModel({
//         userId: user._id,
//         bookId: book._id,
//         borrowDate: new Date(),
//         returnDate,
//         returned: false,
//       });

//       await newBorrow.save();
//       borrowedBooks.push(newBorrow);

//       // Decrease available copies
//       book.availableCopies -= 1;
//       await book.save();
//     }

//     // Remove cart items only if books were successfully borrowed
//     if (borrowedBooks.length > 0) {
//       await cartModel.deleteMany({ userId: user._id });
//       return sucessResponse(res, "Borrowed books successfully", borrowedBooks);
//     }

//     return errorResponse(res, 400, {
//       message: "No books are available",
//       unavailableBooks,
//     });
//   } catch (error) {
//     console.log("_buyBookController_", error);
//     return errorResponse(res, 500, "Internal server error");
//   }
// }


//suraj
// async function checkOutController(req, res) {
//   try {
//     const { email } = res.locals;
//     const { bookId } = req.body;

//     if (!bookId) {
//       return errorResponse(res, 400, "Book ID is required.");
//     }

//     const user = await userModel.findOne({ email });
//     if (!user) return errorResponse(res, 404, "User not found.");

//     const userId = user._id;

//     const book = await bookModel.findById(bookId);
//     if (!book) return errorResponse(res, 404, "Book not found.");

//     if (book.availableCopies <= 0) {
//       return errorResponse(res, 400, "No copies available for borrowing.");
//     }

//     const existingBorrow = await borrowModel.findOne({
//       userId,
//       bookId,
//       returned: false,
//     });

//     if (existingBorrow)
//       return errorResponse(res, 400, "You have already borrowed this book.");

//     const dueDate = new Date();
//     dueDate.setDate(dueDate.getDate() + 14);

//     const newBorrow = new borrowModel({
//       userId,
//       bookId,
//       borrowDate: new Date(),
//       dueDate,
//       returned: false,
//     });

//     await newBorrow.save();

//     book.availableCopies -= 1;
//     await book.save();


//     await cartModel.deleteOne({userId,bookId});

//     return sucessResponse(res, "Book borrowed successfully.", newBorrow);
//   } catch (error) {
//     console.error("Error in borrowing book:", error);
//     return errorResponse(res, 500, "Internal server error.");
//   }
// }

async function getcartController(req, res) {
  try {
    const { email } = res.locals;
    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "user not found");
    }
    const cartItems = await cartModel.find({ userId: user._id });
    if (cartItems.length === 0) return errorResponse(res, 400, "cart is empty");

    const cartItem = await cartModel.find();
    return sucessResponse(res, "Success", cartItem);
  } catch (error) {
    console.log("getcartController__", error);
    return errorResponse(res, 500, "internal server error");
  }
}


async function deletecartController(req,res) {
  try {
    
  } catch (error) {
    console.log("deletecartController__", error);
    return errorResponse(res, 500, "internal server error");
  }
}