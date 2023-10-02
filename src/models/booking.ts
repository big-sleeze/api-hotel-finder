import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  bookingId: string;
  personId: string;
  personFirstName: string;
  personLastName: string;
  hotelId: string;
  startDate: Date;
  endDate: Date;
}

const BookingSchema: Schema = new Schema(
  {
    personId: { type: String, required: true },
    personFirstName: { type: String, required: true },
    personLastName: { type: String, required: true },
    hotelId: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IBooking>("Booking", BookingSchema);
