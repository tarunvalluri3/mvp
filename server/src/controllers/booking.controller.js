import prisma from "../config/db.js";

export const createBooking = async (req, res) => {
  try {
    const { serviceId, eventDate, serviceAddress, notes } = req.body;

    const customerId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: {
        id: customerId,
      },
    });

    if (user.role !== "CUSTOMER") {
      return res.status(403).json({
        success: false,
        message: "Only customers can create bookings",
      });
    }

    const service = await prisma.service.findUnique({
      where: {
        id: serviceId,
      },
      include: {
        vendor: true,
      },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const booking = await prisma.booking.create({
      data: {
        customerId,
        vendorId: service.vendorId,
        serviceId,

        eventDate: new Date(eventDate),

        serviceAddress,

        serviceLatitude: 0,
        serviceLongitude: 0,

        notes,

        status: "REQUESTED",
      },
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const customerId = req.user.userId;

    const bookings = await prisma.booking.findMany({
      where: {
        customerId,
      },
      include: {
        service: true,
        vendor: {
          select: {
            businessName: true,
            address: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVendorBookings = async (req, res) => {
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

    const bookings = await prisma.booking.findMany({
      where: {
        vendorId: vendor.id,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        service: {
          select: {
            id: true,
            serviceName: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const userId = req.user.userId;

    const vendor = await prisma.vendor.findUnique({
      where: {
        userId,
      },
    });

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.vendorId !== vendor.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "CONFIRMED",
      },
    });

    res.status(200).json({
      success: true,
      message: "Booking accepted successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const userId = req.user.userId;

    const vendor = await prisma.vendor.findUnique({
      where: {
        userId,
      },
    });

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.vendorId !== vendor.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "REJECTED",
      },
    });

    res.status(200).json({
      success: true,
      message: "Booking rejected successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};