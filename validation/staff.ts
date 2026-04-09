import * as yup from "yup";

export const staffSchema = yup.object({
  userId: yup.string().required("User ID is required"),
  branchId: yup.string().required("Branch ID is required"),
  position: yup.string().required("Position is required"),
  salary: yup.string().required("Salary is required"),
  joinDate: yup.string().required("Join Date is required"),
  shiftTiming: yup.string().required("Shift Timing is required"),
});