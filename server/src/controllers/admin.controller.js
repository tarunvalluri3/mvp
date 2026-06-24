import prisma from "../config/db.js";

export const getPendingVendors = async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      where: {
        approvalStatus: "PENDING",
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

export const approveVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

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
        approvalStatus: "APPROVED",
      },
    });

    res.status(200).json({
      success: true,
      message: "Vendor approved successfully",
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

export const rejectVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

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
        approvalStatus: "REJECTED",
      },
    });

    res.status(200).json({
      success: true,
      message: "Vendor rejected successfully",
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