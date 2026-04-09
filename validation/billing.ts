import * as yup from "yup";

export const billingSchema = yup.object({
  bookingId: yup.string().required("Booking ID is required"),
  amount: yup.string().required("Amount is required"),
  tax: yup.number().required("Tax is required"),
  discount: yup.number().required("Discount is required"),
  finalAmount: yup.string().required("Final Amount is required"),
  paymentStatus: yup.string().required("Payment Status is required"),
  paymentMethod: yup.string().required("Payment Method is required"),
  paidAmount: yup.string().required("Paid Amount is required"),
});
