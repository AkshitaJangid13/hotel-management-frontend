
export type HouseKeepingFormData = {
  name: string;
  address: string;
  lat: number;
  long: number;
};

export type HouseKeeping = {
  id: string;
  isActive: boolean;
  createdAt: string;
  roomType:{
    name:string;
  },
  amenity:{
    name:string;
  }

};