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
    const { status } = req.query;

    const whereClause = {};

    if (status) {
      whereClause.approvalStatus = status;
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

// export const getPendingVendors = async (req, res) => {
//   try {
//     const vendors = await prisma.vendor.findMany({
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
