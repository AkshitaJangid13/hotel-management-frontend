import * as yup from "yup";

export const roomTypeSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  branchId: yup.string().required("Branch is required"),
});