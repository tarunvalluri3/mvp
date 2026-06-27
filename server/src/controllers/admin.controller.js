import prisma from "../config/db.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      pendingVendors,
      approvedVendors,
      rejectedVendors,
      suspendedVendors,
      categories,
    ] = await Promise.all([
      prisma.vendor.count({
        where: {
          approvalStatus: "PENDING",
        },
      }),

      prisma.vendor.count({
        where: {
          approvalStatus: "APPROVED",
        },
      }),

      prisma.vendor.count({
        where: {
          approvalStatus: "REJECTED",
        },
      }),

      prisma.vendor.count({
        where: {
          approvalStatus: "SUSPENDED",
        },
      }),

      prisma.category.count(),
    ]);

    res.status(200).json({
      success: true,

      stats: {
        pendingVendors,
        approvedVendors,
        rejectedVendors,
        suspendedVendors,
        categories,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVendors = async (req, res) => {
  try {
    const { status, search } = req.query;

    const whereClause = {};

    // Filter by approval status
    if (status && status !== "ALL") {
      whereClause.approvalStatus = status;
    }

    // Search by business name OR owner name
    if (search) {
      whereClause.OR = [
        {
          businessName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    const vendors = await prisma.vendor.findMany({
      where: whereClause,

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      vendors,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//       where: {
//         approvalStatus: "PENDING",
//       },
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             phone: true,
//           },
//         },
//       },
//     });

//     res.status(200).json({
//       success: true,
//       vendors,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const updateVendorStatus = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const { approvalStatus } = req.body;

    const vendor = await prisma.vendor.findUnique({
      where: {
        id: vendorId,
      },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const updatedVendor = await prisma.vendor.update({
      where: {
        id: vendorId,
      },
      data: {
        approvalStatus,
      },
    });

    res.status(200).json({
      success: true,
      message: "Vendor status updated successfully",
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

export const getVendorDetails = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await prisma.vendor.findUnique({
      where: {
        id: vendorId,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },

        services: {
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
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

export const getDashboard = async (req, res) => {
  try {
    const [
      totalVendors,
      totalCustomers,
      totalCategories,
      totalServices,
      totalBookings,
      recentVendors,
      recentBookings,
      vendorStatus,
    ] = await Promise.all([
      prisma.vendor.count(),

      prisma.user.count({
        where: {
          role: "CUSTOMER",
        },
      }),

      prisma.category.count(),

      prisma.service.count(),

      prisma.booking.count(),

      prisma.vendor.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),

      prisma.booking.findMany({
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

          vendor: {
            select: {
              businessName: true,
            },
          },

          service: {
            select: {
              serviceName: true,
            },
          },
        },
      }),
      prisma.vendor.groupBy({
        by: ["approvalStatus"],

        _count: {
          approvalStatus: true,
        },
      }),
    ]);

    res.status(200).json({
      success: true,

      stats: {
        totalVendors,
        totalCustomers,
        totalCategories,
        totalServices,
        totalBookings,
      },

      recentVendors,

      recentBookings,

      vendorStatus,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      where: {
        role: "CUSTOMER",
      },

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCustomerDetails = async (req, res) => {
  try {
    const { customerId } = req.params;

    const customer = await prisma.user.findUnique({
      where: {
        id: customerId,
      },

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,

        bookings: {
          include: {
            service: {
              select: {
                serviceName: true,
                price: true,
              },
            },

            vendor: {
              select: {
                businessName: true,
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
