import prisma from "../config/db.js";

export const createService = async (req, res) => {
  try {
    const {
      serviceName,
      description,
      price,
      categoryId,
      serviceType,
    } = req.body;

    const userId = req.user.userId;

    const vendor = await prisma.vendor.findUnique({
      where: {
        userId,
      },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    if (vendor.approvalStatus !== "APPROVED") {
      return res.status(403).json({
        success: false,
        message: "Vendor is not approved",
      });
    }

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

    const service = await prisma.service.create({
      data: {
        vendorId: vendor.id,
        categoryId,
        serviceName,
        description,
        price,
        serviceType,
      },
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};