import * as yup from "yup";

export const roomSchema = yup.object({
  branchId: yup.string().required("Branch is required"),
  companyId: yup.string().required("Company is required"),
  brandId: yup.string().required("Brand is required"),
  roomTypeId: yup.string().required("Room Type is required"),
  roomNumber: yup.string().required("Room Number is required"),
  floor: yup.string().required("Floor is required"),
  notes: yup.string().required("Notes is required"),
});