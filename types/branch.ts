
export type BranchFormData = {
  name: string;
  address: string;
  lat: number;
  long: number;
};

export type Branch = {
  id: string;
  name: string;
  addressId: string;
  isActive: boolean;
  address: {
    address: string;
    lat: string;
    long: string;
  };
};