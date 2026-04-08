export type UserFormData = {
  name: string;
  email: string;
  role: string;
  companyId: string;
  password?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string;
  password?: string;
  status: string;
  createdAt: string;
  isActive: boolean;
  company: {
    name: string;
  };
};
