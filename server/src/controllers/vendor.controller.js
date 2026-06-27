import prisma from "../config/db.js";

export const createVendorProfile = async (req, res) => {
  try {
    const { businessName, businessDescription, address, latitude, longitude } =
      req.body;

    const userId = req.user.userId;
    const role = req.user.role;

    // Only vendors can create profiles
    if (role !== "VENDOR") {
      return res.status(403).json({
        success: false,
        message: "Only vendors can create profiles",
      });
    }

    // Check if profile already exists
    const existingVendor = await prisma.vendor.findUnique({
      where: {
        userId,
      },
    });

    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: "Vendor profile already exists",
      });
    }

    const vendor = await prisma.vendor.create({
      data: {
        userId,
        businessName,
        businessDescription,
        address,
        latitude,
        longitude,
      },
    });

    res.status(201).json({
      success: true,
      message: "Vendor profile created successfully",
      vendor,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVendorProfile = async (req, res) => {
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

    const [serviceCount, activeServices, inactiveServices, bookingCount] =
      await Promise.all([
        prisma.service.count({
          where: {
            vendorId: vendor.id,
          },
        }),

        prisma.service.count({
          where: {
            vendorId: vendor.id,
            status: "ACTIVE",
          },
        }),

        prisma.service.count({
          where: {
            vendorId: vendor.id,
            status: "INACTIVE",
          },
        }),

        prisma.booking.count({
          where: {
            vendorId: vendor.id,
          },
        }),
      ]);

    const recentServices = await prisma.service.findMany({
      where: {
        vendorId: vendor.id,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        serviceName: true,
        price: true,
        serviceType: true,
      },
    });

    const recentBookings = await prisma.booking.findMany({
      where: {
        vendorId: vendor.id,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        customer: {
          select: {
            name: true,
          },
        },

        service: {
          select: {
            serviceName: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      vendor,
      stats: {
        services: serviceCount,
        bookings: bookingCount,
        activeServices,
        inactiveServices,
      },
      recentServices,

      recentBookings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateVendorProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { businessName, businessDescription, address, latitude, longitude } =
      req.body;

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

    const updatedVendor = await prisma.vendor.update({
      where: {
        id: vendor.id,
      },
      data: {
        businessName,
        businessDescription,
        address,
        latitude,
        longitude,
      },
    });

    res.status(200).json({
      success: true,
      message: "Vendor profile updated successfully",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
