
export type RoomTypeAmenitiesFormData = {
  amenityId: string;
  roomTypeId: string;
};

export type RoomTypeAmenities = {
  id: string;
  isActive: boolean;
  createdAt: string;
  amenityId: string;
  roomTypeId: string;
  roomType:{
    name:string;
  },
  amenity:{
    name:string;
  }

};