// types/staff.ts
export type StaffFormData = {
  userId: string;
  branchId: string;
  position: string;
  salary: string;
  joinDate: string;
  shiftTiming: string;
};

export type Staff = {
  id: string;
  userId: string;
  branchId: string;
  position: string;
  salary: string;
  joinDate: string;
  shiftTiming: string;
  createdAt: string;
  isActive: boolean;
  user?: {
    id: string;
    name: string;
  };
  branch?: {
    id: string;
    name: string;
  };
};