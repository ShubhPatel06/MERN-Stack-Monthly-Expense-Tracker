import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
