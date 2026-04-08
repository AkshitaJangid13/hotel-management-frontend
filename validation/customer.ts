import * as yup from "yup";

export const customerSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  phone: yup.string().required("Phone is required"),
  address: yup.string().required("Address is required"),
  lat: yup.number().required(),
  long: yup.number().required(),
  companyId: yup.string().required("Company is required"),
  idType: yup.string().required("ID Type is required"),
  idNumber: yup.string().required("ID Number is required"),
});