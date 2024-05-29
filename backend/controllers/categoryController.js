import Category from "../models/category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ userID: req.user.id }).lean();
    res.send(categories);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const newCategory = new Category({ userID: req.user.id, name });
    await newCategory.save();
    res.status(201).send(newCategory);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const category = await Todo.findById(id).exec();

    if (!category) {
      return res.status(404).send("Category not found!");
    }

    if (category.userID !== req.user.id) {
      return res
        .status(401)
        .send("You are not authorized to update this category!");
    }

    category.name = name;
    const updatedCategory = await category.save();

    res.send(updatedCategory);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params.id;
  try {
    const category = await Category.findById(id).exec();

    if (!category) {
      return res.status(404).send("Category not found!");
    }

    if (category.userID !== req.user.id) {
      return res
        .status(401)
        .send("You are not authorized to delete this category!");
    }

    const result = await Category.deleteOne();
    const reply = `Category '${result.name}' with ID ${result._id} deleted`;

    res.json(reply);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
};
