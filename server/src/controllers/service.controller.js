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

export const getMyServices = async (req, res) => {
  try {
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

    const services = await prisma.service.findMany({
      where: {
        vendorId: vendor.id,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; 

export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const {
      serviceName,
      description,
      price,
      serviceType,
    } = req.body;

    const userId = req.user.userId;

    const vendor = await prisma.vendor.findUnique({
      where: {
        userId,
      },
    });

    const service = await prisma.service.findUnique({
      where: {
        id: serviceId,
      },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    if (service.vendorId !== vendor.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const updatedService = await prisma.service.update({
      where: {
        id: serviceId,
      },
      data: {
        serviceName,
        description,
        price,
        serviceType,
      },
    });

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};  

export const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const userId = req.user.userId;

    const vendor = await prisma.vendor.findUnique({
      where: {
        userId,
      },
    });

    const service = await prisma.service.findUnique({
      where: {
        id: serviceId,
      },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    if (service.vendorId !== vendor.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    await prisma.service.delete({
      where: {
        id: serviceId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};