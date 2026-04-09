export type BillingFormData = {
  invoiceNumber?: string;
  bookingId: string;
  amount: string;
  tax: number;
  discount: number;
  finalAmount: string;
  paymentStatus: string;
  paymentMethod: string;
  paidAmount: string;
};

export type Billing = {
  id: string;
  invoiceNumber?: string;
  bookingId: string;
  amount: string;
  tax: number;
  discount: number;
  finalAmount: string;
  paymentStatus: string;
  paymentMethod: string;
  paidAmount: string;
  createdAt: string;
  booking:{
    id:string;
    bookingNumber:string;
  },
  isActive: boolean;
};
