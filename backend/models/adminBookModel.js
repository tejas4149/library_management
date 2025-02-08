import { timeStamp } from "console";
import { model, Schema } from "mongoose";
import { type } from "os";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },
    ISBN_code: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    publishedDate: {
      type: Date,
    },
  },
  { timeStamps: true }
);

const bookModel = model("books", bookSchema);

export default bookModel;
