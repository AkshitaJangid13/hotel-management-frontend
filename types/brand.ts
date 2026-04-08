
export type BrandFormData = {
  name: string;
  email:string;
  phone:string; 
  address: string;
  branchId:string;
  lat: number;
  long: number;
};

export type Brand = {
  id: string;
  name: string;
  addressId: string;
  email: string;
  phone: string;
  branchId:string;
  createdAt: string;
  isActive: boolean;
  address: {
    address: string;
    lat: string;
    long: string;
  };
  branch: {
    name: string;
  };
};