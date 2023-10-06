import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import Hotel, { IHotel } from "../models/hotel";
import Booking, { IBooking } from "../models/booking";
import { bookingSchema } from "../library/validation";

export const hotelController = {
  getHotels: async (req: Request, res: Response) => {
    const { lat, lng } = req.query;
    let response: AxiosResponse | undefined;
    try {
      response = await axios.get(
        `https://discover.search.hereapi.com/v1/discover`,
        {
          params: {
            at: `${lat},${lng}`,
            q: "hotels",
            apiKey: process.env.API_KEY,
          },
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0",
          },
        }
      );
    } catch (error) {
      return res.status(500).json({
        error: `An error occurred while fetching hotels: ${
          (error as Error).message
        }`,
      });
    }

    if (response && response.data && response.data.items) {
      const items = response.data.items;
      const hotelPromises = response.data.items.map(async (item: IHotel) => {
        const contact =
          item.contacts && item.contacts.length > 0 ? item.contacts[0] : {};
        const www = contact.www ? contact.www.map((c) => c.value) : undefined;
        const mobile = contact.mobile
          ? contact.mobile.map((c) => c.value)
          : undefined;
        const phone = contact.phone
          ? contact.phone.map((c) => c.value)
          : undefined;

        let hotelData = {
          title: item.title,
          _id: item.id,
          address: {
            countryName: item.address.countryName,
            city: item.address.city,
            district: item.address.district,
            street: item.address.street,
            postalCode: item.address.postalCode,
            houseNumber: item.address.houseNumber,
          },
          position: {
            lat: item.position.lat,
            lng: item.position.lng,
          },
          www,
          mobile,
          phone,
        };

        let hotel = await Hotel.findOneAndUpdate({ _id: item.id }, hotelData, {
          new: true,
          upsert: true,
        }).select("-__v");

        return hotel;
      });

      const hotels = await Promise.all(hotelPromises);
      res.json(hotels);
    } else {
      return res.status(500).json({
        error: "Invalid API response",
        details: response,
      });
    }
  },
  getAllHotels: async (req: Request, res: Response) => {
    const hotels = await Hotel.find();
    res.json(hotels);
  },
};

export const bookingController = {
  createBooking: async (req: Request, res: Response) => {
    const { error } = bookingSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ errors });
    }

    const {
      personId,
      personFirstName,
      personLastName,
      hotelId,
      startDate,
      endDate,
    } = req.body;

    // Convert the start and end dates to Date objects
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Get today's date and set the hours, minutes, seconds and milliseconds to 0
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if the start date is in the past
    if (startDateObj < today) {
      return res
        .status(400)
        .json({ error: "Start date cannot be in the past" });
    }

    // Check if the end date is in the past
    if (endDateObj < today) {
      return res.status(400).json({ error: "End date cannot be in the past" });
    }

    // Check if the start date is later than the end date
    if (startDateObj > endDateObj) {
      return res
        .status(400)
        .json({ error: "Start date cannot be later than end date" });
    }

    const existingPerson = await Booking.findOne({ personId });

    if (existingPerson) {
      if (
        existingPerson.personFirstName !== personFirstName ||
        existingPerson.personLastName !== personLastName
      ) {
        return res.status(400).json({
          error: "This ID is already associated with a different name",
        });
      }
    } else {
      const existingName = await Booking.findOne({
        personFirstName,
        personLastName,
      });
      if (existingName) {
        return res.status(400).json({
          error: "This name is already associated with a different ID",
        });
      }
    }

    const existingBooking = await Booking.findOne({
      personId,
      hotelId,
      startDate,
      endDate,
    });

    if (existingBooking) {
      return res
        .status(409)
        .json({ error: "A booking with the same details already exists!!" });
    }

    const hotelExists = await Hotel.exists({ _id: hotelId });

    if (!hotelExists) {
      return res
        .status(404)
        .json({ error: "Hotel with ID " + hotelId + " does not exist" });
    }

    if (
      personId === undefined ||
      personFirstName === undefined ||
      personLastName === undefined ||
      hotelId === undefined ||
      startDate === undefined ||
      endDate === undefined
    ) {
      return res
        .status(400)
        .json({ error: "Required fields are missing from request body" });
    }

    const booking: IBooking = new Booking({
      personId,
      personFirstName,
      personLastName,
      hotelId,
      startDate,
      endDate,
    });

    let savedBooking;

    try {
      savedBooking = await booking.save();
      savedBooking = savedBooking.toObject();
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error saving booking " + (error as Error).message });
    }

    res.status(201).json(savedBooking);
  },

  getBookings: async (req: Request, res: Response) => {
    const { personFirstName, personLastName, personId, startDate, endDate } =
      req.query;
    let query: any = {
      personFirstName: personFirstName,
      personLastName: personLastName,
      personId: personId,
    };

    if (startDate && endDate) {
      query.startDate = { $gte: new Date(startDate as string) };
      query.endDate = { $lte: new Date(endDate as string) };
    }

    try {
      let bookings = await Booking.find(query);
      return res.status(200).json({ bookings });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "An error occurred while fetching bookings." });
    }
  },

  getAllBookings: async (req: Request, res: Response) => {
    const bookings = await Booking.find();
    res.json(bookings);
  },

  updateBooking: async (req: Request, res: Response) => {
    const {
      personId,
      personFirstName,
      personLastName,
      _id,
      startDate,
      endDate,
    } = req.body;

    // Fetch the existing booking
    const existingBooking = await Booking.findById(req.params.bookingId);

    if (!existingBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Use the existing start date if a new one isn't provided
    const startDateObj = startDate
      ? new Date(startDate)
      : existingBooking.startDate;
    const endDateObj = new Date(endDate);

    // Check if the end date is earlier than the start date
    if (endDateObj < startDateObj) {
      return res
        .status(400)
        .json({ error: "End date cannot be earlier than start date" });
    }

    const update = {
      personId,
      personFirstName,
      personLastName,
      _id,
      startDate: startDateObj,
      endDate: endDateObj,
    };

    let updatedBooking;
    try {
      updatedBooking = await Booking.findOneAndUpdate(
        { _id: req.params.bookingId },
        update,
        { new: true }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error updating booking " + (error as Error).message });
    }

    res.status(200).json(updatedBooking);
  },

  deleteBooking: async (req: Request, res: Response) => {
    let deletedBooking;
    try {
      deletedBooking = await Booking.deleteOne({ _id: req.params.bookingId });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error deleting booking: " + (error as Error).message });
    }

    if (deletedBooking.deletedCount === 0) {
      return res.status(404).json({
        error: `Booking with the ID ${req.params.bookingId} not found`,
      });
    }

    res.status(200).json({
      message: `Booking with the ${req.params.bookingId} deleted successfully!`,
    });
  },
};
