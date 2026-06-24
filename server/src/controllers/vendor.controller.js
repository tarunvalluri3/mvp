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