import Joi from "joi";

export const bookingSchema = Joi.object({
  personId: Joi.string().required().messages({
    "string.empty": `Person ID cannot be empty`,
    "any.required": `Person ID is a required field`,
  }),
  personFirstName: Joi.string()
    .pattern(new RegExp("^[p{L}p{Zs}]*$", "u"))
    .required()
    .messages({
      "string.empty": `First name cannot be empty`,
      "any.required": `First name is a required field`,
      "string.pattern.base": `First name can only contain letters and spaces`,
    }),
  personLastName: Joi.string()
    .pattern(new RegExp("^[p{L}p{Zs}]*$", "u"))
    .required()
    .messages({
      "string.empty": `Last name cannot be empty`,
      "any.required": `Last name is a required field`,
      "string.pattern.base": `Last name can only contain letters and spaces`,
    }),
  hotelId: Joi.string().required().messages({
    "string.empty": `Hotel ID cannot be empty`,
    "any.required": `Hotel ID is a required field`,
  }),
  startDate: Joi.date().required().messages({
    "date.greater": `Start date must be in the future`,
    "any.required": `Start date is a required field`,
    "date.empty": "Start date cannot be empty",
  }),
  endDate: Joi.date().required().messages({
    "date.greater": `End date must be after start date`,
    "any.required": `End date is a required field`,
    "date.empty": "Start date cannot be empty",
  }),
});
