import * as yup from "yup";

export const brandSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  phone: yup.string().required("Phone is required"),
  address: yup.string().required("Address is required"),
  branchId: yup.string().required("Branch is required"),
  lat: yup.number().required(),
  long: yup.number().required(),
});