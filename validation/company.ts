import * as yup from "yup";

export const companySchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  phone: yup.string().required("Phone is required"),
  address: yup.string().required("Address is required"),
  lat: yup.number().required(),
  long: yup.number().required(),
});