export type CompanyFormData = {
  name: string;
  email: string;
  address: string;
  lat: number;
  long: number;
  phone: string;
};

export type Company = {
  id: string;
  name: string;
  email: string;
  addressId: string;
  address: {
    address: string;
    lat: number;
    long: number;
  };
  phone: string;
  createdAt: string;
  isActive: boolean;
};
