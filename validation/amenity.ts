import * as yup from "yup";

export const amenitySchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  icon: yup.string().required("Icon is required"),
});