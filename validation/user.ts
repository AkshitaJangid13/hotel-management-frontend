import * as yup from "yup";

export const userSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().required("Email is required"),
  role: yup.string().required("Role is required"),
  companyId: yup.string().required("Company is required"),
  password: yup.string().optional() // ✅ important
    .nullable(),
});