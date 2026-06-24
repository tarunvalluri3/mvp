import prisma from "../config/db.js";

export const createService = async (req, res) => {
  try {
    const { serviceName, description, price, categoryId, serviceType } =
      req.body;

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
        category: {
          select: {
            id: true,
            name: true,
          },
        },
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

export const getMyServiceById = async (req, res) => {
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
      include: {
        category: true,
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

    res.status(200).json({
      success: true,
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

export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const { serviceName, description, price, serviceType } = req.body;

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

export const deactivateService = async (req, res) => {
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

    const updatedService = await prisma.service.update({
      where: {
        id: serviceId,
      },
      data: {
        status: "INACTIVE",
      },
    });

    res.status(200).json({
      success: true,
      message: "Service deactivated successfully",
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

export const activateService = async (req, res) => {
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

    const updatedService = await prisma.service.update({
      where: {
        id: serviceId,
      },
      data: {
        status: "ACTIVE",
      },
    });

    res.status(200).json({
      success: true,
      message: "Service activated successfully",
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
