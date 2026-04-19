// validation/booking.ts
import * as yup from "yup";

export const bookingSchema = yup.object({
  customerId: yup
    .string()
    .uuid("Customer ID must be a valid UUID")
    .required("Customer is required"),

  roomId: yup
    .string()
    .uuid("Room ID must be a valid UUID")
    .required("Room is required"),

  branchId: yup
    .string()
    .uuid("Branch ID must be a valid UUID")
    .required("Branch is required"),

  checkInDate: yup.string().required("Check-in date is required"),

  checkOutDate: yup
    .string()
    .required("Check-out date is required")
    .test(
      "is-after-checkin",
      "Check-out date must be after check-in date",
      function (value) {
        const { checkInDate } = this.parent;
        if (!checkInDate || !value) return true;
        return new Date(value) > new Date(checkInDate);
      },
    ),

  adults: yup
    .number()
    .min(1, "At least 1 adult is required")
    .required("Number of adults is required"),

  children: yup
    .number()
    .min(0, "Children cannot be negative")
    .required("Number of children is required"),

  totalAmount: yup
    .number()
    .min(0, "Total amount cannot be negative")
    .required("Total amount is required"),

  discount: yup.number().min(0, "Discount cannot be negative").default(0),

  tax: yup.number().min(0, "Tax cannot be negative").default(0),

  status: yup.string().required(),
  specialRequests: yup.string().optional(),
});
