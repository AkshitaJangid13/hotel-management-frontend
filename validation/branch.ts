import * as yup from "yup";

export const branchSchema = yup.object({
  name: yup.string().required("Name is required"),
  address: yup.string().required("Address is required"),
  lat: yup.number().required(),
  long: yup.number().required(),
});