import express from "express";
import { hotelController, bookingController } from "../controller/booking";
import Booking from "../models/booking";
import Hotel from "../models/hotel";

const router = express.Router();

router.get("/hotels", hotelController.getHotels);
router.get("/all-hotels", hotelController.getAllHotels);
router.get("/hotels/:_id/bookings", async (req, res) => {
  const hotelId = req.params._id;

  const hotelExists = await Hotel.exists({ _id: hotelId });
  if (!hotelExists) {
    return res
      .status(404)
      .json({ error: `Hotel with ID ${hotelId} does not exist` });
  }

  const bookings = await Booking.find({ hotelId: hotelId });
  res.json(bookings);
});
router.get("/hotels/:hotelId", async (req, res) => {
  const hotelId = req.params.hotelId;

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    return res
      .status(404)
      .json({ error: `Hotel with ID ${hotelId} does not exist` });
  }

  res.json(hotel);
});

router.get("/bookings/booking", bookingController.getBookings);
router.get("/bookings", bookingController.getAllBookings);
router.post("/bookings", bookingController.createBooking);
router.put("/bookings/:bookingId", bookingController.updateBooking);
router.delete("/bookings/:bookingId", bookingController.deleteBooking);
export default router;
