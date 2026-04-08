export type CustomerFormData = {
  name: string;
  email: string;
  companyId: string;
  idType: string;
  idNumber: string;
  address: string;
  lat: number;
  long: number;
  phone: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  addressId: string;
  companyId: string;
  idType: string;
  idNumber: string;
  address: {
    address: string;
    lat: number;
    long: number;
  };
  company: {
    name: string;
  };
  phone: string;
  createdAt: string;
  isActive: boolean;
};
