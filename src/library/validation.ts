import { object, string, date } from "yup";

export const Schemas = {
  data: object().shape({
    personId: string()
      .required()
      .matches(
        /^[\p{L}\p{N}]*$/u,
        "personId can only contain letters and numbers"
      ),
    personFirstName: string()
      .required()
      .matches(/^\p{L}*$/u, "personFirstName can only contain letters"),
    personLastName: string()
      .required()
      .matches(/^\p{L}*$/u, "personLastName can only contain letters"),
    hotelId: string().required(),
    startDate: date().required(),
    endDate: date().required(),
  }),
};
