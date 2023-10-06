import express from "express";
import { hotelController, bookingController } from "../controller/booking";
import Booking from "../models/booking";
import Hotel from "../models/hotel";

const router = express.Router();

// Get all the nearby hotels on a specific location. Lat & lng are required
router.get("/hotels", hotelController.getHotels);

// Get all the hotels that exist on the database
router.get("/all-hotels", hotelController.getAllHotels);

// Fetches all the bookings for a specific hotel
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

// Fetches a specific hotel that exists on the database
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

// Fetches bookings based on query parameters (personFirstName, personLastName, personId, startDate, endDate)
router.get("/bookings/booking", bookingController.getBookings);

// Fetches all bookings from the database
router.get("/bookings", bookingController.getAllBookings);

// Creates a new booking
router.post("/bookings", bookingController.createBooking);

// Updates a specific booking by its ID
router.put("/bookings/:bookingId", bookingController.updateBooking);

// Deletes a specific booking by its ID
router.delete("/bookings/:bookingId", bookingController.deleteBooking);

export default router;
