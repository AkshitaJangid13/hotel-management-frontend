export type RoomTypeFormData = {
  name: string;
  description: string;
  branchId: string;
};

export type RoomType = {
  id: string;
  name: string;
  description: string;
  branchId: string;
  createdAt: string;
  isActive: boolean;
  branch: {
    name: string;
  };
};
