import prisma from "../config/db.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existingCategory =
      await prisma.category.findUnique({
        where: {
          name,
        },
      });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  } 
}; 

export const getCategories = async (req, res) => {
  try {
    const categories =
      await prisma.category.findMany({
        orderBy: {
          name: "asc",
        },
      });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; 


export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
      },
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; 

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const servicesCount = await prisma.service.count({
      where: {
        categoryId,
      },
    });

    if (servicesCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with existing services",
      });
    }

    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};