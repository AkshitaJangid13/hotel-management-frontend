export type RoomFormData = {
  roomNumber: string;
  floor: string;
  notes: string;
  branchId: string;
  companyId: string;
  brandId: string;
  roomTypeId: string;
};

export type Room = {
  id: string;
  roomNumber: string;
  floor: string;
  notes: string;
  createdAt: string;
  isActive: boolean;
  branchId: string;
  companyId: string;
  brandId: string;
  roomTypeId: string;
  branch: {
    name: string;
  };
  roomType: {
    name: string;
  };
  company: {
    name: string;
  };
  brand: {
    name: string;
  };
};
