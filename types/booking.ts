// types/booking.ts
export type BookingFormData = {
  bookingNumber: string;
  customerId: string;
  roomId: string;
  branchId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  totalAmount: number;
  discount: number;
  tax: number;
  finalAmount: number;
  status: string;
  specialRequests?: string;
};

export type Booking = {
  id: string;
  bookingNumber: string;
  customerId: string;
  roomId: string;
  branchId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  totalAmount: number;
  discount: number;
  tax: number;
  finalAmount: number;
  status: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled";
  specialRequests?: string;
  createdAt: string;
  isActive: boolean;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  room?: {
    id: string;
    name: string;
    roomNumber: string;
  };
  branch?: {
    id: string;
    name: string;
  };
};