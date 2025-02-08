import { Schema, model } from "mongoose";

const borrowSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  bookId: {
    type: Schema.Types.ObjectId,
    ref: "book",
    required: true,
  },
  borrowDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    default: null,
  },
  returned: {
    type: Boolean,
    default: false,
  },
  fineAmount: {
    type: Number,
    default: 0,
  },
});

const borrowModel = model("borrow", borrowSchema);
export default borrowModel;
