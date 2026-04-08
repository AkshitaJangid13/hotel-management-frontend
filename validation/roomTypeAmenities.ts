import * as yup from "yup";

export const roomTypeAmenitiesSchema = yup.object({
  amenityId: yup.string().required("Amenity is required"),
  roomTypeId: yup.string().required("Room Type is required"),
});
