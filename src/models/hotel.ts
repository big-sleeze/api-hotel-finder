import mongoose, { Document, Schema } from "mongoose";

export interface IHotel extends Document {
  title: string;
  _id: string;
  address: {
    countryName: string;
    city: string;
    district?: string;
    street?: string;
    postalCode?: string;
    houseNumber?: string;
  };
  position: {
    lat: number;
    lng: number;
  };
  contacts?: {
    www?: { value: string }[];
    mobile?: { value: string }[];
    phone?: { value: string }[];
  }[];
}

const HotelSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    _id: { type: String, required: true },
    address: {
      countryName: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: false },
      street: { type: String, required: false },
      postalCode: { type: String, required: false },
      houseNumber: { type: String, required: false },
    },
    position: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    www: { type: [String], required: false },
    mobile: { type: [String], required: false },
    phone: { type: [String], required: false },
  },
  { versionKey: false }
);

export default mongoose.model<IHotel>("Hotel", HotelSchema);
