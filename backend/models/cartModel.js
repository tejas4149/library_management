import { Schema, model, Types } from "mongoose";

const cartSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookId: {
    type: Types.ObjectId,
    ref: "Book",
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const cartModel = model("cart", cartSchema);
export default cartModel;
